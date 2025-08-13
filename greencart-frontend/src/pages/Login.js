import React, { useState } from 'react';
import API from '../api';
import { setToken } from '../auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('manager@example.com');
  const [password, setPassword] = useState('manager123');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await API.post('/auth/login', { email, password });
      setToken(res.data.token);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth:480, margin:'20px auto' }}>
      <div className="card">
        <h2>Manager Login</h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button type="submit">Login</button>
            <button type="button" className="small-btn" onClick={()=>{ setEmail('manager@example.com'); setPassword('manager123'); }}>Use seed creds</button>
          </div>
          {err && <div style={{ color:'#d9534f', marginTop:8 }}>{err}</div>}
        </form>
      </div>
      <div style={{ textAlign:'center', marginTop:8 }} className="small">Seed user: <b>manager@example.com</b> / <b>manager123</b></div>
    </div>
  );
}
