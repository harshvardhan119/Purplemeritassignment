const express = require('express');
const router = express.Router();
const { runSimulation, getHistory } = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

router.post('/run', protect, runSimulation);
router.get('/history', protect, getHistory);

module.exports = router;
