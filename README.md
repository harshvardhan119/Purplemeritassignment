Perfect 👍
Here’s your **README.md** fully tailored for your submission.

---

```markdown
# Full Stack Developer Assessment – Harsh Vardhan Singh

## 📌 Project Overview
This project is part of the Purple Merit Technologies Full Stack Developer Assessment.  
It simulates **GreenCart Logistics** delivery operations, allowing managers to:
- Run delivery simulations with custom parameters.
- Manage drivers, routes, and orders via CRUD operations.
- View KPIs such as **Total Profit**, **Efficiency Score**, and detailed charts.
- Track on-time vs. late deliveries and fuel cost breakdown.

The application is deployed as a full-stack app (frontend + backend) in one service.

---

## 🚀 Live Deployment
- **Full Application (Frontend + Backend)**: [https://purplemeritassignment.onrender.com/login](https://purplemeritassignment.onrender.com/login)  
- **Database**: MongoDB Atlas (Cloud-hosted)  
- **Simulation Walkthrough Video**: [Watch Here](https://www.loom.com/share/2630ec117a8147888e6e1b6bb9db9791?sid=5a952e7f-f33f-45a9-8505-0fc7c47fd6ab)  

---

## 🛠 Tech Stack
**Frontend:**
- React (Hooks)
- Chart.js (for data visualization)
- Axios (API requests)

**Backend:**
- Node.js + Express.js
- Mongoose (MongoDB ORM)
- bcrypt (password hashing)
- JWT (authentication)
- dotenv (environment variables)

**Database:**
- MongoDB Atlas (Cloud-hosted)

---

## 📂 Project Structure
```

/frontend     → React frontend
/backend      → Node.js + Express backend

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/harshvardhan119/Purplemeritassignment.git
cd Purplemeritassignment
````

### 2️⃣ Backend Setup

```bash
cd backend
npm run dev/node server.js
```

Create a `.env` file in `/backend` with:

```
PORT
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
CORS_ORIGIN

```

Run backend:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in `/frontend` with:

```
REACT_APP_API_URL=
```

Run frontend:

```bash
npm start
```

---

## 🔐 Environment Variables

**Backend:**

* `PORT` → Server port.
* `MONGODB_URI` → MongoDB Atlas connection string.
* `JWT_SECRET` → Secret for JWT authentication.
* `JWT_EXPIRES_IN` → "1d"
* `CORS_ORIGIN` → "port"


**Frontend:**

* `REACT_APP_API_URL` → Base URL for backend API.

---



## 📜 API Documentation

* All API routes follow REST standards.
* Includes authentication, CRUD for **Drivers**, **Routes**, **Orders**, and simulation endpoint.
* Authentication is via JWT.
* Example:

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "manager@example.com",
  "password": "manager123"
}
```

**Response:**

```json
{
  "token": "JWT_TOKEN_STRING",
  "user": {
    "id": "66b...",
    "name": "Manager",
    "email": "manager@example.com"
  }
}
```
**drivers**
```http
GET all drivers
GET http://localhost:5000/api/drivers
Headers: Authorization: Bearer <token>
POST create driver
POST http://localhost:5000/api/drivers
Headers: Authorization: Bearer <token>
```
```json
Body:
{
  "name": "Test Driver",
  "shift_hours": 6,
  "past_week_hours": [8,8,8,8,8,8,8]
}
```
```http
PUT update driver
PUT http://localhost:5000/api/drivers/{driver_id}
Body:
{ "shift_hours": 7 }
DELETE http://localhost:5000/api/drivers/{driver_id}
```
**Routes**
GET /api/routes
POST /api/routes
```json
{
  "route_id": 11,
  "distance_km": 10,
  "traffic_level": "Low",
  "base_time_min": 50
}
```

**Orders**
```http
GET /api/orders
POST /api/orders
```
```json
{
  "order_id": 99,
  "value_rs": 2000,
  "route_id": 1,
  "delivery_time_hhmm": "01:30"
}
```

**Simulation API**
```http
POST http://localhost:5000/api/simulations/run
Headers: Authorization: Bearer <token>
```
```json
Body:
{
  "number_of_drivers": 5,
  "start_time": "08:00",
  "max_hours_per_driver": 8
}
```
**Response**
```json
{
  "id": "66b...",
  "kpis": {
    "total_profit": 12345.67,
    "efficiency": 85.71,
    "on_time_deliveries": 42,
    "late_deliveries": 7,
    "total_deliveries": 49,
    "fuel_cost_total": 3000
  },
  "details": [
    {
      "order_id": 1,
      "assigned_to": "Amit",
      "actual_minutes": 100,
      "isOnTime": true,
      "penalty": 0,
      "bonus": 200,
      "fuelCost": 150,
      "orderProfit": 2450
    }
  ]
}
```

---

## 📦 Deployment

* **Platform**: Render (Full-stack deployment in one service)
* **Database**: MongoDB Atlas
* **Process**:

  1. Build frontend in `/frontend` using `npm run build`.
  2. Serve build folder from Express backend.
  3. Deploy to Render as a single service.

---

## 🎥 Walkthrough Video

🔗 [Watch Simulation & App Demo](https://www.loom.com/share/2630ec117a8147888e6e1b6bb9db9791?sid=5a952e7f-f33f-45a9-8505-0fc7c47fd6ab)

---

## 👨‍💻 Author

**Harsh Vardhan Singh**

```


