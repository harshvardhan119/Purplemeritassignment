import React, { useEffect, useState } from 'react';
import API from '../api';

export default function OrdersMgmt(){
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id:'', value_rs:'', route_id:'', delivery_time_hhmm:'' });

  useEffect(()=>{ fetch(); }, []);
  const fetch = async ()=> { const res = await API.get('/orders'); setOrders(res.data); };

  const create = async ()=> {
    await API.post('/orders', { order_id:Number(form.order_id), value_rs:Number(form.value_rs), route_id:Number(form.route_id), delivery_time_hhmm:form.delivery_time_hhmm });
    setForm({ order_id:'', value_rs:'', route_id:'', delivery_time_hhmm:'' }); fetch();
  };

  const del = async (id) => { if(!window.confirm('Delete order?')) return; await API.delete(`/orders/${id}`); fetch(); };

  return (
    <div>
      <h2>Orders</h2>
      <div className="card">
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input placeholder="order id" value={form.order_id} onChange={e=>setForm({...form, order_id:e.target.value})} />
          <input placeholder="value (₹)" value={form.value_rs} onChange={e=>setForm({...form, value_rs:e.target.value})} />
          <input placeholder="route_id" value={form.route_id} onChange={e=>setForm({...form, route_id:e.target.value})} />
          <input placeholder="delivery time HH:MM" value={form.delivery_time_hhmm} onChange={e=>setForm({...form, delivery_time_hhmm:e.target.value})} />
          <button onClick={create}>Add Order</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Order</th><th>Value</th><th>Route</th><th>ETA</th><th></th></tr></thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o._id}>
                <td>{o.order_id}</td>
                <td>₹{o.value_rs}</td>
                <td>{o.route_id}</td>
                <td>{o.delivery_time_hhmm}</td>
                <td><button className="small-btn" onClick={()=>del(o._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
