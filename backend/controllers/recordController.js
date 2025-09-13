const MedicalRecord = require('../models/MedicalRecord');

exports.getMyRecord = async(req, res) => {
    try {
        const mr = await MedicalRecord.findOne({ patient: req.user._id }).populate({
            path: 'entries.ref',
            model: 'Prescription'
        });
        res.json({ record: mr || { patient: req.user._id, entries: [] } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};