import React, { useEffect, useState } from 'react';
import API from '../api';

export default function RoutesMgmt(){
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ route_id:'', distance_km:'', traffic_level:'Low', base_time_min:'' });

  useEffect(()=>{ fetch(); }, []);
  const fetch = async ()=> { const res = await API.get('/routes'); setRoutes(res.data); };

  const create = async ()=> {
    await API.post('/routes', { route_id:Number(form.route_id), distance_km:Number(form.distance_km), traffic_level:form.traffic_level, base_time_min:Number(form.base_time_min) });
    setForm({ route_id:'', distance_km:'', traffic_level:'Low', base_time_min:'' }); fetch();
  };

  const del = async (id)=> { if(!window.confirm('Delete route?')) return; await API.delete(`/routes/${id}`); fetch(); };

  return (
    <div>
      <h2>Routes</h2>
      <div className="card">
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input placeholder="route_id" value={form.route_id} onChange={e=>setForm({...form, route_id:e.target.value})} />
          <input placeholder="distance_km" value={form.distance_km} onChange={e=>setForm({...form, distance_km:e.target.value})} />
          <select value={form.traffic_level} onChange={e=>setForm({...form, traffic_level:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select>
          <input placeholder="base_time_min" value={form.base_time_min} onChange={e=>setForm({...form, base_time_min:e.target.value})} />
          <button onClick={create}>Add Route</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Route</th><th>Distance</th><th>Traffic</th><th>Base time</th><th></th></tr></thead>
          <tbody>
            {routes.map(r=>(
              <tr key={r._id}>
                <td>{r.route_id}</td>
                <td>{r.distance_km} km</td>
                <td>{r.traffic_level}</td>
                <td>{r.base_time_min} min</td>
                <td><button className="small-btn" onClick={()=>del(r._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
