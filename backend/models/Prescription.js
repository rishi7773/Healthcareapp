const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    name: String,
    dosage: String,
    duration: String,
    instructions: String
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medications: [medicationSchema],
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);