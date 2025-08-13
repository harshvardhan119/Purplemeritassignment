import React, { useEffect, useState } from 'react';
import API from '../api';
import OnTimeLateChart from '../components/OnTimeLateChart';
import FuelBreakdownChart from '../components/FuelBreakdownChart';

export default function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await API.get('/simulations/history');
        setLatest(res.data && res.data.length ? res.data[0] : null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="card">Loading...</div>;
  if (!latest) return <div className="card">No simulation history. Run a simulation.</div>;

  const k = latest.kpis;
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card">
          <h3>Total Profit</h3>
          <div style={{ fontSize:24, fontWeight:700 }}>₹{k.total_profit}</div>
          <div className="small">As of {new Date(latest.runAt).toLocaleString()}</div>
        </div>
        <div className="card">
          <h3>Efficiency</h3>
          <div style={{ fontSize:24, fontWeight:700 }}>{k.efficiency}%</div>
          <div className="small">{k.on_time_deliveries} on-time / {k.late_deliveries} late</div>
        </div>
        <OnTimeLateChart onTime={k.on_time_deliveries} late={k.late_deliveries} />
        <FuelBreakdownChart totalFuel={k.fuel_cost_total} />
      </div>

      <div className="card" style={{ marginTop:12 }}>
        <h3>Recent simulation orders (sample)</h3>
        <pre className="pre">{JSON.stringify(latest.details.slice(0,12), null, 2)}</pre>
      </div>
    </div>
  );
}
