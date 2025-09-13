const { validationResult } = require('express-validator');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

// Doctor creates prescription
exports.createPrescription = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { appointmentId, medications, notes } = req.body;
        const appt = await Appointment.findById(appointmentId);
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });

        // only assigned doctor can create prescription
        if (!appt.doctor.equals(req.user._id)) return res.status(403).json({ message: 'Not allowed' });

        const prescription = new Prescription({
            appointment: appointmentId,
            patient: appt.patient,
            doctor: req.user._id,
            medications,
            notes
        });
        await prescription.save();

        // add entry to medical record
        let mr = await MedicalRecord.findOne({ patient: appt.patient });
        if (!mr) {
            mr = new MedicalRecord({ patient: appt.patient, entries: [] });
        }
        mr.entries.push({
            type: 'prescription',
            date: new Date(),
            summary: notes || 'Prescription issued',
            ref: prescription._id
        });
        mr.updatedAt = new Date();
        await mr.save();

        res.status(201).json({ prescription });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single prescription by ID
exports.getPrescription = async(req, res) => {
    try {
        const { id } = req.params;
        const pres = await Prescription.findById(id).populate('doctor patient appointment');
        if (!pres) return res.status(404).json({ message: 'Not found' });
        res.json({ prescription: pres });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all prescriptions for a patient
exports.getPatientPrescriptions = async(req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor appointment');
        res.json({ prescriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all prescriptions issued by a doctor
exports.getDoctorPrescriptions = async(req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctor: req.user._id }).populate('patient appointment');
        res.json({ prescriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};