const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET all poojas
router.get('/', async (req, res) => {
    try {
        const poojas = await prisma.pooja.findMany();
        res.json(poojas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new pooja
router.post('/', async (req, res) => {
    const { name, description, rate } = req.body;
    try {
        const pooja = await prisma.pooja.create({
            data: { name, description, rate: parseFloat(rate) },
        });
        res.json(pooja);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE pooja
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, rate, isActive } = req.body;
    try {
        const pooja = await prisma.pooja.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                rate: rate ? parseFloat(rate) : undefined,
                isActive
            },
        });
        res.json(pooja);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE pooja
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.pooja.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Pooja deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
