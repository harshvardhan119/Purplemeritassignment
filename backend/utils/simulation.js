/**
 * simulation.js
 * Implements company rules:
 *  - penalty ₹50 if actual_delivery_time_min > base_time_min + 10
 *  - driver fatigue: if last day's hours > 8 -> time * 1.3 (increase 30%)
 *  - high value bonus: if value > 1000 AND on-time -> +10% of order value (added to profit)
 *  - fuel cost: ₹5/km + ₹2/km if traffic == High
 *  - profit per order = order.value_rs + bonus - penalty - fuel_cost
 *
 * Inputs:
 *  - drivers (array of { _id, name, shift_hours, past_week_hours })
 *  - routes (map by route_id -> { route_id, distance_km, traffic_level, base_time_min })
 *  - orders (array of { order_id, value_rs, route_id, delivery_time_hhmm })
 *  - inputs: { number_of_drivers, start_time, max_hours_per_driver }
 *
 * Output:
 *  - kpis + per-order details
 */

function hhmmToMinutes(hhmm) {
  const [hh, mm] = hhmm.split(':').map(Number);
  return hh * 60 + mm;
}

function simulate({ drivers, routesMap, orders, inputs }) {
  // choose available drivers (first N)
  const N = Math.min(inputs.number_of_drivers, drivers.length);
  const activeDrivers = drivers.slice(0, N).map(d => ({
    ...d,
    assignedMinutes: 0,
    fatigue: (Array.isArray(d.past_week_hours) && d.past_week_hours.length > 0 && d.past_week_hours[d.past_week_hours.length - 1] > 8)
  }));

  const orderDetails = [];
  let onTime = 0, late = 0, totalFuel = 0, totalProfit = 0;
  // For assignment: greedy: assign to driver with least assignedMinutes that fits max hours
  const maxMinutesPerDriver = inputs.max_hours_per_driver * 60;

  for (const order of orders) {
    const route = routesMap[order.route_id];
    if (!route) {
      // skip order if route missing
      orderDetails.push({ order_id: order.order_id, assigned: false, reason: 'route_missing' });
      continue;
    }
    // base time:
    let estimatedMin = route.base_time_min;
    // apply fatigue increase: if driver fatigued -> +30% time (multiply by 1.3)
    // but we need to choose which driver; try to find best driver that can handle it.
    // We'll compute estimated time per driver and find earliest fitting driver (least assigned minutes)
    let chosenDriverIndex = -1;
    let chosenEstMin = null;

    // sort drivers by current assignedMinutes ascending
    const sortedIdx = activeDrivers.map((d, i) => i).sort((a, b) => activeDrivers[a].assignedMinutes - activeDrivers[b].assignedMinutes);

    for (const idx of sortedIdx) {
      const d = activeDrivers[idx];
      const est = d.fatigue ? Math.round(estimatedMin * 1.3) : estimatedMin;
      if (d.assignedMinutes + est <= maxMinutesPerDriver) {
        chosenDriverIndex = idx;
        chosenEstMin = est;
        break;
      }
    }

    if (chosenDriverIndex === -1) {
      // nobody can take it within max hours -> mark unassigned (counts as late)
      late++;
      orderDetails.push({ order_id: order.order_id, assigned: false, reason: 'no_capacity' });
      continue;
    }

    // assign
    const driver = activeDrivers[chosenDriverIndex];
    driver.assignedMinutes += chosenEstMin;

    // company rules compute:
    const actualMin = chosenEstMin;
    const basePlus10 = route.base_time_min + 10;
    let penalty = 0;
    let bonus = 0;
    const isOnTime = actualMin <= basePlus10;
    if (!isOnTime) { penalty = 50; late++; } else { onTime++; }

    if (order.value_rs > 1000 && isOnTime) {
      bonus = order.value_rs * 0.10;
    }

    const perKm = 5 + (route.traffic_level === 'High' ? 2 : 0);
    const fuelCost = route.distance_km * perKm;

    const orderProfit = order.value_rs + bonus - penalty - fuelCost;

    totalFuel += fuelCost;
    totalProfit += orderProfit;

    orderDetails.push({
      order_id: order.order_id,
      assigned_to: driver.name,
      actual_minutes: actualMin,
      base_time_min: route.base_time_min,
      isOnTime,
      penalty,
      bonus,
      fuelCost,
      orderProfit
    });
  }

  const totalDeliveries = onTime + late;
  const efficiency = totalDeliveries === 0 ? 0 : (onTime / totalDeliveries) * 100;

  return {
    kpis: {
      total_profit: Math.round(totalProfit * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      on_time_deliveries: onTime,
      late_deliveries: late,
      total_deliveries: totalDeliveries,
      fuel_cost_total: Math.round(totalFuel * 100) / 100
    },
    details: orderDetails,
    driver_summary: activeDrivers.map(d => ({ name: d.name, assignedMinutes: d.assignedMinutes, fatigue: d.fatigue }))
  };
}

module.exports = { simulate, hhmmToMinutes };
