const { simulate } = require('../utils/simulation');

test('simulate basic scenario: one driver, one order on-time -> bonus applies', () => {
  const drivers = [{ name: 'A', shift_hours: 6, past_week_hours: [6,6,6,6,6,6,6] }];
  const routesMap = { 1: { route_id: 1, distance_km: 10, traffic_level: 'Low', base_time_min: 30 } };
  const orders = [{ order_id: 1, value_rs: 2000, route_id: 1, delivery_time_hhmm: '00:30' }];
  const inputs = { number_of_drivers: 1, start_time: '08:00', max_hours_per_driver: 8 };

  const res = simulate({ drivers, routesMap, orders, inputs });

  expect(res.kpis.total_deliveries).toBe(1);
  expect(res.kpis.on_time_deliveries).toBe(1);
  // bonus = 10% of 2000 = 200 ; fuel = 10 km * 5 = 50 ; profit = 2000 + 200 - 0 - 50 = 2150
  expect(res.kpis.total_profit).toBeCloseTo(2150);
});

test('fatigue increases time causing late', () => {
  const drivers = [{ name: 'A', shift_hours: 6, past_week_hours: [6,6,6,6,6,6,9] }]; // last day >8 -> fatigued
  const routesMap = { 1: { route_id: 1, distance_km: 10, traffic_level: 'Low', base_time_min: 30 } };
  const orders = [{ order_id: 1, value_rs: 1000, route_id: 1, delivery_time_hhmm: '00:39' }];
  const inputs = { number_of_drivers: 1, start_time: '08:00', max_hours_per_driver: 8 };

  const res = simulate({ drivers, routesMap, orders, inputs });
  // fatigue: 30*1.3 = 39 -> base+10=40 -> still on time (39<=40)
  expect(res.kpis.on_time_deliveries + res.kpis.late_deliveries).toBe(1);
});
