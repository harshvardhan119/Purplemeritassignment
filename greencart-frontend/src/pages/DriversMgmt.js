import React, { useEffect, useState } from 'react';
import API from '../api';

export default function DriversMgmt() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name:'', shift_hours:8, past_week_hours:'8|8|8|8|8|8|8' });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchList(); }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await API.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const create = async () => {
    await API.post('/drivers', { name: form.name, shift_hours: Number(form.shift_hours), past_week_hours: form.past_week_hours.split('|').map(Number) });
    setForm({ name:'', shift_hours:8, past_week_hours:'8|8|8|8|8|8|8' });
    fetchList();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    await API.delete(`/drivers/${id}`);
    fetchList();
  };

  return (
    <div>
      <h2>Drivers</h2>
      <div className="card">
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Shift hours" value={form.shift_hours} onChange={e=>setForm({...form, shift_hours:e.target.value})} />
          <input style={{ minWidth:240 }} placeholder="Past week (pipe sep)" value={form.past_week_hours} onChange={e=>setForm({...form, past_week_hours:e.target.value})} />
          <button onClick={create}>Add Driver</button>
        </div>
      </div>

      <div className="card">
        {loading ? <div>Loading...</div> :
          <table className="table">
            <thead><tr><th>Name</th><th>Shift</th><th>Past week</th><th></th></tr></thead>
            <tbody>
              {drivers.map(d=>(
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.shift_hours}</td>
                  <td>{d.past_week_hours.join(', ')}</td>
                  <td><button className="small-btn" onClick={()=>remove(d._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
