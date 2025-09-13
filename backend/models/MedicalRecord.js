const mongoose = require('mongoose');

const recordEntrySchema = new mongoose.Schema({
    type: { type: String }, // 'visit', 'prescription', 'lab', etc.
    date: { type: Date, default: Date.now },
    summary: String,
    ref: { type: mongoose.Schema.Types.ObjectId } // reference to prescription/appointment if needed
}, { _id: false });

const medicalRecordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    entries: [recordEntrySchema],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);