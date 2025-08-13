const express = require('express');
const router = express.Router();
const { listOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, listOrders);
router.post('/', protect, createOrder);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
