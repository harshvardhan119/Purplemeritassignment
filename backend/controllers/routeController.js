const asyncHandler = require('express-async-handler');
const Route = require('../models/Route');

const listRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

const createRoute = asyncHandler(async (req, res) => {
  const { route_id, distance_km, traffic_level, base_time_min } = req.body;
  if (route_id == null) { res.status(400); throw new Error('Invalid payload'); }
  const r = await Route.create({ route_id, distance_km, traffic_level, base_time_min });
  res.status(201).json(r);
});

const updateRoute = asyncHandler(async (req, res) => {
  const r = await Route.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Route not found'); }
  Object.assign(r, req.body);
  await r.save();
  res.json(r);
});

const deleteRoute = asyncHandler(async (req, res) => {
  const r = await Route.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Route not found'); }
  await r.remove();
  res.json({ message: 'Route removed' });
});

module.exports = { listRoutes, createRoute, updateRoute, deleteRoute };
