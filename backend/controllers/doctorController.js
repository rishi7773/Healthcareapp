const User = require('../models/User');

exports.listDoctors = async(req, res) => {
    try {
        const filter = { role: 'doctor' };
        if (req.query.specialization) filter.specialization = { $regex: req.query.specialization, $options: 'i' };
        const doctors = await User.find(filter).select('-password');
        res.json({ doctors });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};