require("dotenv").config({ override: true });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const reminderJob = require('./jobs/reminderJob');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const recordRoutes = require('./routes/records');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/records', recordRoutes);

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start reminder job after server starts
    reminderJob.start();
});