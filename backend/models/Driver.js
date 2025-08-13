const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, required: true },
  past_week_hours: { type: [Number], required: true } // array of 7 numbers; last is most recent (yesterday)
});

module.exports = mongoose.model('Driver', driverSchema);
