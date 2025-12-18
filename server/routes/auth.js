const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const SECRET_KEY = "temple_secret_key"; // In prod, use env var

// REGISTER
router.post('/register', async (req, res) => {
    const { name, age, gender, star, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                age: parseInt(age),
                gender,
                star,
                email,
                phone,
                password: hashedPassword,
                role: 'USER'
            }
        });
        res.json({ message: "User registered successfully", userId: user.id });
    } catch (err) {
        res.status(500).json({ error: "Registration failed. Email might be taken." });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
