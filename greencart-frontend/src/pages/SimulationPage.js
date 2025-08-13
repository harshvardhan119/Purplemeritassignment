import React, { useState } from 'react';
import API from '../api';

export default function SimulationPage(){
  const [numDrivers, setNumDrivers] = useState(5);
  const [startTime, setStartTime] = useState('08:00');
  const [maxHours, setMaxHours] = useState(8);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');
  const [running, setRunning] = useState(false);

  const run = async (e) => {
    e.preventDefault();
    setErr(''); setRunning(true); setResult(null);
    try {
      const res = await API.post('/simulations/run', { number_of_drivers: Number(numDrivers), start_time: startTime, max_hours_per_driver: Number(maxHours) });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr(e.response?.data?.message || 'Error running simulation');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <h2>Run Simulation</h2>
      <div className="card">
        <form onSubmit={run}>
          <div className="form-row">
            <div>
              <label className="small">Number of drivers</label><br />
              <input type="number" min="1" value={numDrivers} onChange={e=>setNumDrivers(e.target.value)} />
            </div>
            <div>
              <label className="small">Start time (HH:MM)</label><br />
              <input value={startTime} onChange={e=>setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="small">Max hours / driver</label><br />
              <input type="number" min="1" value={maxHours} onChange={e=>setMaxHours(e.target.value)} />
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button type="submit" disabled={running}>{running ? 'Running...' : 'Run Simulation'}</button>
            <button type="button" className="small-btn" onClick={()=>{ setNumDrivers(5); setStartTime('08:00'); setMaxHours(8); }}>Reset</button>
          </div>
        </form>
      </div>

      {err && <div style={{ color:'#d9534f', marginTop:8 }}>{err}</div>}

      {result && (
        <div className="card">
          <h3>KPIs</h3>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <div><b>Total profit:</b> ₹{result.kpis.total_profit}</div>
            <div><b>Efficiency:</b> {result.kpis.efficiency}%</div>
            <div><b>On-time:</b> {result.kpis.on_time_deliveries}</div>
            <div><b>Late:</b> {result.kpis.late_deliveries}</div>
            <div><b>Fuel cost total:</b> ₹{result.kpis.fuel_cost_total}</div>
          </div>

          <h4 style={{ marginTop:12 }}>Sample order details</h4>
          <pre className="pre">{JSON.stringify(result.details.slice(0,15), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
