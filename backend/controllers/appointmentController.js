const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.createAppointment = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { doctorId, appointmentDate, reason } = req.body;
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') return res.status(400).json({ message: 'Invalid doctor' });

        const appt = new Appointment({
            patient: req.user._id,
            doctor: doctorId,
            appointmentDate,
            reason,
            status: 'pending'
        });
        await appt.save();
        res.status(201).json({ appointment: appt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPatientAppointments = async(req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', '-password');
        res.json({ appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDoctorAppointments = async(req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id, appointmentDate: { $gte: new Date() } })
            .populate('patient', '-password')
            .sort({ appointmentDate: 1 });
        res.json({ appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rescheduleAppointment = async(req, res) => {
    try {
        const { id } = req.params;
        const { newDate } = req.body;
        const appt = await Appointment.findById(id);
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });

        // only patient who booked or the doctor can reschedule
        if (!appt.patient.equals(req.user._id) && !appt.doctor.equals(req.user._id))
            return res.status(403).json({ message: 'Not allowed' });

        appt.appointmentDate = new Date(newDate);
        appt.reminderSent = false; // reset reminder flag
        await appt.save();
        res.json({ appointment: appt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelAppointment = async(req, res) => {
    try {
        const { id } = req.params;
        const appt = await Appointment.findById(id);
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });

        // only patient who booked or the doctor can cancel
        if (!appt.patient.equals(req.user._id) && !appt.doctor.equals(req.user._id))
            return res.status(403).json({ message: 'Not allowed' });

        appt.status = 'cancelled';
        await appt.save();
        res.json({ appointment: appt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};