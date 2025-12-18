const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new event
router.post('/', async (req, res) => {
    const { name, date, description } = req.body;
    try {
        const event = await prisma.event.create({
            data: { name, date: new Date(date), description },
        });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE event
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, description } = req.body;
    try {
        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: { name, date: new Date(date), description },
        });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.event.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
