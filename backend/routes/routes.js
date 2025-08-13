const express = require('express');
const router = express.Router();
const { listRoutes, createRoute, updateRoute, deleteRoute } = require('../controllers/routeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, listRoutes);
router.post('/', protect, createRoute);
router.put('/:id', protect, updateRoute);
router.delete('/:id', protect, deleteRoute);

module.exports = router;
