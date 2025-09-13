const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const recordController = require('../controllers/recordController');

// patient view their medical record
router.get('/me', protect, authorize('patient'), recordController.getMyRecord);

module.exports = router;