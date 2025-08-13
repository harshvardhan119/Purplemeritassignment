const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const { order_id, value_rs, route_id, delivery_time_hhmm } = req.body;
  if (order_id == null || value_rs == null || route_id == null || !delivery_time_hhmm) {
    res.status(400);
    throw new Error('Invalid order payload');
  }
  const o = await Order.create({ order_id, value_rs, route_id, delivery_time_hhmm });
  res.status(201).json(o);
});

const updateOrder = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) { res.status(404); throw new Error('Order not found'); }
  Object.assign(o, req.body);
  await o.save();
  res.json(o);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) { res.status(404); throw new Error('Order not found'); }
  await o.remove();
  res.json({ message: 'Order removed' });
});

module.exports = { listOrders, createOrder, updateOrder, deleteOrder };
