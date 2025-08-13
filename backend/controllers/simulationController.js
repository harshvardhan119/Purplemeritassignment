const asyncHandler = require('express-async-handler');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');
const SimulationResult = require('../models/SimulationResult');
const { simulate } = require('../utils/simulation');

const runSimulation = asyncHandler(async (req, res) => {
  const { number_of_drivers, start_time, max_hours_per_driver } = req.body;
  if (number_of_drivers == null || !start_time || max_hours_per_driver == null) {
    res.status(400);
    throw new Error('Missing simulation inputs');
  }
  if (number_of_drivers <= 0 || max_hours_per_driver <= 0) {
    res.status(400);
    throw new Error('Inputs must be positive');
  }

  const drivers = await Driver.find();
  const routesArr = await Route.find();
  const orders = await Order.find();

  const routesMap = {};
  routesArr.forEach(r => { routesMap[r.route_id] = r.toObject(); });

  const simResult = simulate({
    drivers: drivers.map(d => ({
      _id: d._id,
      name: d.name,
      shift_hours: d.shift_hours,
      past_week_hours: d.past_week_hours
    })),
    routesMap,
    orders: orders.map(o => ({
      order_id: o.order_id,
      value_rs: o.value_rs,
      route_id: o.route_id,
      delivery_time_hhmm: o.delivery_time_hhmm
    })),
    inputs: { number_of_drivers, start_time, max_hours_per_driver }
  });

  // persist
  const saved = await SimulationResult.create({
    inputs: { number_of_drivers, start_time, max_hours_per_driver },
    kpis: simResult.kpis,
    details: simResult.details
  });

  res.json({ id: saved._id, kpis: simResult.kpis, details: simResult.details });
});

const getHistory = asyncHandler(async (req, res) => {
  const hist = await SimulationResult.find().sort({ runAt: -1 }).limit(50);
  res.json(hist);
});

module.exports = { runSimulation, getHistory };
