const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['patient', 'doctor', 'admin'])
], authController.register);

router.post('/login', authController.login);

router.get('/me', protect, authController.me);

module.exports = router;