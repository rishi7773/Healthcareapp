const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async(req, res, next) => {
    const authHeader = req.headers.authorization || req.cookies.token;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    else if (req.cookies && req.cookies.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token invalid' });
    }
};

// role check middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
        next();
    };
};