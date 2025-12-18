const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET all bookings (Admin) or filtered by userId (User)
router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const where = userId ? { userId: parseInt(userId) } : {};
        const bookings = await prisma.booking.findMany({
            where,
            include: { pooja: true, user: true },
            orderBy: { date: 'desc' }
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new booking
router.post('/', async (req, res) => {
    const { userId, poojaId, devoteeName, devoteeStar, date } = req.body;
    try {
        // Basic validation
        if (!userId || !poojaId || !date) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: parseInt(userId),
                poojaId: parseInt(poojaId),
                devoteeName,
                devoteeStar,
                date: new Date(date),
                status: 'CONFIRMED' // Auto-confirm for now
            },
            include: { pooja: true }
        });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE booking (Only if date is in future)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { devoteeName, devoteeStar, date, poojaId } = req.body;

    try {
        const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Check if booking is in the past
        if (new Date(booking.date) < new Date()) {
            return res.status(400).json({ error: "Cannot edit past bookings" });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                devoteeName,
                devoteeStar,
                date: date ? new Date(date) : undefined,
                poojaId: poojaId ? parseInt(poojaId) : undefined
            },
            include: { pooja: true }
        });
        res.json(updatedBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE booking (Only if date is in future)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        if (new Date(booking.date) < new Date()) {
            return res.status(400).json({ error: "Cannot cancel past bookings" });
        }

        await prisma.booking.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
