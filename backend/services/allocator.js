// src/services/allocator.js

/**
 * Greedy round-robin assignment of orders to drivers
 * respecting maxHoursPerDay per driver.
 *
 * Inputs:
 *  - orders: Array<Order> (already sorted in desired sequence)
 *  - routesMap: Map(routeId -> { distanceKm, trafficLevel, baseTimeMin })
 *  - drivers: Array<Driver> [{ _id, name, currentShiftHours, past7DayHours }]
 *  - maxHoursPerDay: Number (hours)
 *
 * Output:
 *  - assignments: Array<{ order, driverIndex, route, actualTimeMin }>
 *    (orders that don't fit any driver's remaining time are simply skipped)
 */
export const allocateOrders = ({ orders, routesMap, drivers, maxHoursPerDay }) => {
  if (!Array.isArray(orders) || !orders.length) return [];
  if (!Array.isArray(drivers) || !drivers.length) return [];

  // Track per-driver state (minutes already used today, and yesterday hours)
  const state = drivers.map((d) => ({
    driver: d,
    minutesUsed: Math.round((d.currentShiftHours || 0) * 60),
    workedYesterday: Array.isArray(d.past7DayHours) && d.past7DayHours.length
      ? Number(d.past7DayHours[d.past7DayHours.length - 1] || 0)
      : 0
  }));

  const maxMinutes = Math.round(Number(maxHoursPerDay) * 60);
  let cursor = 0;
  const assignments = [];

  for (const order of orders) {
    const route = routesMap.get(order.assignedRouteId);
    if (!route) continue; // skip orders with unknown route

    // Precompute fatigue-adjusted time for this order per each driver
    // (yesterday > 8h => 1.3x)
    const timePerDriver = state.map((s) => {
      const mult = s.workedYesterday > 8 ? 1.3 : 1.0;
      return Math.round(route.baseTimeMin * mult);
    });

    // Try to place this order starting from current cursor
    let placed = false;
    let tries = 0;

    while (!placed && tries < state.length) {
      const i = cursor % state.length;
      const s = state[i];
      const needed = timePerDriver[i];

      if (s.minutesUsed + needed <= maxMinutes) {
        // Assign to driver i
        s.minutesUsed += needed;
        assignments.push({ order, driverIndex: i, route, actualTimeMin: needed });
        cursor = i + 1; // move round-robin cursor forward
        placed = true;
      } else {
        // Try next driver
        cursor++;
        tries++;
      }
    }

    // If not placed, we skip this order — capacity exceeded across all drivers
  }

  return assignments;
};
