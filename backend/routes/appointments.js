const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// create appointment (patient)
router.post('/', protect, authorize('patient'), [
    body('doctorId').notEmpty(),
    body('appointmentDate').notEmpty()
], appointmentController.createAppointment);

// patient appointments
router.get('/me', protect, authorize('patient'), appointmentController.getPatientAppointments);

// doctor upcoming appointments
router.get('/doctor', protect, authorize('doctor'), appointmentController.getDoctorAppointments);

// reschedule (patient or doctor)
router.put('/:id/reschedule', protect, appointmentController.rescheduleAppointment);

// cancel
router.put('/:id/cancel', protect, appointmentController.cancelAppointment);

module.exports = router;