const asyncHandler = require('express-async-handler');
const Driver = require('../models/Driver');

const listDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

const createDriver = asyncHandler(async (req, res) => {
  const { name, shift_hours, past_week_hours } = req.body;
  if (!name || shift_hours == null || !Array.isArray(past_week_hours)) {
    res.status(400);
    throw new Error('Invalid driver payload');
  }
  const d = await Driver.create({ name, shift_hours, past_week_hours });
  res.status(201).json(d);
});

const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  Object.assign(driver, req.body);
  await driver.save();
  res.json(driver);
});

const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) { res.status(404); throw new Error('Driver not found'); }
  await driver.remove();
  res.json({ message: 'Driver removed' });
});

module.exports = { listDrivers, createDriver, updateDriver, deleteDriver };
