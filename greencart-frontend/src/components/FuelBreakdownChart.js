import React from 'react';

export default function FuelBreakdownChart({ totalFuel = 0 }) {
  return (
    <div className="card">
      <h4>Fuel Cost</h4>
      <div style={{ fontSize: 22, fontWeight:700 }}>₹{totalFuel}</div>
      <div className="small">Total fuel cost for last simulation</div>
    </div>
  );
}
