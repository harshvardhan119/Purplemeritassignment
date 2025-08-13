require('dotenv').config();
const connectDB = require('../config/db');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await connectDB();

  // clear existing
  await Driver.deleteMany({});
  await Route.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({});

  // create manager user (email: manager@example.com, password: manager123)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('manager123', salt);
  await User.create({ name: 'Manager', email: 'manager@example.com', passwordHash: hash });

  // Drivers CSV (from your message)
  const driversCsv = `Amit,6,6|8|7|7|7|6|10
Priya,6,10|9|6|6|6|7|7
Rohit,10,10|6|10|7|10|9|7
Neha,9,10|8|6|7|9|8|8
Karan,7,7|8|6|6|9|6|8
Sneha,8,10|8|6|9|10|6|9
Vikram,6,10|8|10|8|10|7|6
Anjali,6,7|8|6|7|6|9|8
Manoj,9,8|7|8|8|7|8|6
Pooja,10,7|10|7|7|9|9|8`;

  const driverLines = driversCsv.trim().split('\n');
  for (const line of driverLines) {
    const [name, shift_hours, past] = line.split(',');
    const past_week_hours = past.split('|').map(x => Number(x));
    await Driver.create({ name: name.trim(), shift_hours: Number(shift_hours), past_week_hours });
  }

  // Routes CSV
  const routesCsv = `1,25,High,125
2,12,High,48
3,6,Low,18
4,15,Medium,60
5,7,Low,35
6,15,Low,75
7,20,Medium,100
8,19,Low,76
9,9,Low,45
10,22,High,88`;

  for (const line of routesCsv.trim().split('\n')) {
    const [route_id, distance_km, traffic_level, base_time_min] = line.split(',');
    await Route.create({
      route_id: Number(route_id),
      distance_km: Number(distance_km),
      traffic_level: traffic_level.trim(),
      base_time_min: Number(base_time_min)
    });
  }

  // Orders CSV (from your message)
  const ordersCsv = `1,2594,7,02:07
2,1835,6,01:19
3,766,9,01:06
4,572,1,02:02
5,826,3,00:35
6,2642,2,01:02
7,1763,10,01:47
8,2367,5,01:00
9,247,2,01:12
10,1292,6,01:12
11,1402,7,01:40
12,2058,1,02:11
13,2250,3,00:40
14,635,5,01:05
15,2279,10,01:30
16,826,6,01:15
17,2409,9,00:35
18,2653,6,01:36
19,279,2,01:01
20,1459,4,00:53
21,1186,10,01:23
22,550,8,01:10
23,2381,3,00:16
24,2902,8,01:41
25,876,5,00:58
26,2684,7,01:43
27,2408,4,01:09
28,1834,6,01:33
29,2319,8,01:13
30,1215,4,00:54
31,1584,1,02:32
32,2468,4,01:27
33,1102,1,01:59
34,2784,1,02:09
35,476,1,02:16
36,490,9,00:50
37,1340,8,01:19
38,2408,3,00:44
39,2560,8,01:21
40,2137,7,01:42
41,586,2,01:05
42,1651,7,01:56
43,2112,1,02:01
44,448,7,01:51
45,647,4,01:02
46,979,9,01:03
47,774,7,01:41
48,1340,8,01:21
49,508,8,01:41
50,601,1,02:29`;

  for (const line of ordersCsv.trim().split('\n')) {
    const [order_id, value_rs, route_id, delivery_time] = line.split(',');
    await Order.create({
      order_id: Number(order_id),
      value_rs: Number(value_rs),
      route_id: Number(route_id),
      delivery_time_hhmm: delivery_time
    });
  }

  console.log('Seed finished.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
