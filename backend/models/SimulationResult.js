const mongoose = require('mongoose');

const simSchema = new mongoose.Schema({
  runAt: { type: Date, default: Date.now },
  inputs: {
    number_of_drivers: Number,
    start_time: String,
    max_hours_per_driver: Number
  },
  kpis: {
    total_profit: Number,
    efficiency: Number,
    on_time_deliveries: Number,
    late_deliveries: Number,
    total_deliveries: Number,
    fuel_cost_total: Number
  },
  details: Object // optional, store per-order results
});

module.exports = mongoose.model('SimulationResult', simSchema);
