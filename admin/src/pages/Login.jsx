import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:4000/api/admin/auth/login',
        form
      );
      localStorage.setItem('admin_token', res.data.token);
      window.location.href = '/admin/events';
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <form
        onSubmit={login}
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(178,13,18,0.25)',
          padding: '32px 28px',
          borderRadius: 12,
          boxShadow: '0 0 30px rgba(0,0,0,0.3)',
          color: 'white'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: '#e21b23',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontWeight: 900,
              fontSize: 20,
              color: 'black'
            }}
          >
            TED
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>
            Admin Login
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white'
            }}
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white'
            }}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 22,
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            background: '#e21b23',
            color: 'black',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
