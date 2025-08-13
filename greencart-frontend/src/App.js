import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SimulationPage from './pages/SimulationPage';
import DriversMgmt from './pages/DriversMgmt';
import RoutesMgmt from './pages/RoutesMgmt';
import OrdersMgmt from './pages/OrdersMgmt';
import PrivateRoute from './components/PrivateRoute';
import { removeToken, isLoggedIn } from './auth';
import { NavLink } from 'react-router-dom';

// Layout Component with Sidebar & Topbar
function Layout({ children, onLogout }) {
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>GreenCart</h2>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/simulation">Simulation</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/routes">Routes</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
      </div>
      <div className="main">
        <div className="topbar">
          <h1>Manager Panel</h1>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const logout = () => {
    removeToken();
    window.location.href = '/login';
  };

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={isLoggedIn() ? <Navigate to="/" /> : <Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout onLogout={logout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/simulation" element={<SimulationPage />} />
                <Route path="/drivers" element={<DriversMgmt />} />
                <Route path="/routes" element={<RoutesMgmt />} />
                <Route path="/orders" element={<OrdersMgmt />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
