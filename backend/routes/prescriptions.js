const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

// Doctor creates prescription
router.post(
    '/',
    protect,
    authorize('doctor'), [
        body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
        body('medications').isArray().optional()
    ],
    prescriptionController.createPrescription
);

// Get a prescription by ID (doctor & patient both can access if authorized)
router.get('/:id', protect, prescriptionController.getPrescription);

// Patient: get all their prescriptions (history)
router.get(
    '/patient/history',
    protect,
    authorize('patient'),
    prescriptionController.getPatientPrescriptions
);

// Doctor: get prescriptions they have issued
router.get(
    '/doctor/history',
    protect,
    authorize('doctor'),
    prescriptionController.getDoctorPrescriptions
);

// Get a prescription by ID (doctor & patient both can access if authorized)
router.get('/:id', protect, prescriptionController.getPrescription);
module.exports = router;