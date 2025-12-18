const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const eventRoutes = require('./routes/events');
const poojaRoutes = require('./routes/poojas');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', eventRoutes);
app.use('/api/poojas', poojaRoutes);
app.use('/api/bookings', require('./routes/bookings'));

// PORT moved to bottom
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAdmin() {
    const email = "admin@temple.com";
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
            data: {
                name: "Temple Admin",
                age: 99,
                gender: "Male",
                star: "Rohini",
                email,
                phone: "9999999999",
                password: hashedPassword,
                role: "ADMIN"
            }
        });
        console.log("Admin user created: admin@temple.com / admin123");
    }
}

// ... imports same
const path = require('path');

// ... routes same

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
// ... prisma/seedAdmin same

// Start Server
app.listen(PORT, async () => {
    await seedAdmin();
    console.log(`Server running on port ${PORT}`);
});
