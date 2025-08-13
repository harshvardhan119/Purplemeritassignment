const express = require('express');
const router = express.Router();
const { listDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/auth');

router.get('/', protect, listDrivers);
router.post('/', protect, createDriver);
router.put('/:id', protect, updateDriver);
router.delete('/:id', protect, deleteDriver);

module.exports = router;
