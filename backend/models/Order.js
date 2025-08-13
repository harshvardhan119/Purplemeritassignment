const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time_hhmm: { type: String, required: true } // original data HH:MM (if needed)
});

module.exports = mongoose.model('Order', orderSchema);
