// admin/src/pages/SpeakersAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function apiImagePath(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${base}/${p.replace(/^\/+/, '')}`;
}

/* Small IconButton used for inline actions */
function IconButton({ title, onClick, children, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 36,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.06)',
        background: danger ? (disabled ? 'rgba(210,30,30,0.65)' : '#e21b23') : 'transparent',
        color: danger ? 'black' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 6,
      }}
    >
      {children}
    </button>
  );
}

/* Avatar with error fallback (initials) */
function Avatar({ src, name, size = 48 }) {
  const [errored, setErrored] = useState(false);
  const initials = (name || '?').split(' ').filter(Boolean).map(s => s.charAt(0).toUpperCase()).slice(0,2).join('');
  const styleImg = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.04)',
    display: errored || !src ? 'none' : 'block'
  };
  const placeholderStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 700,
    fontSize: Math.max(14, Math.floor(size/2.5))
  };

  return (
    <div style={{ width: size, height: size }}>
      {src && !errored ? (
        <img
          src={src}
          alt={name || 'avatar'}
          style={styleImg}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : null}
      {(errored || !src) && <div style={placeholderStyle} aria-hidden>{initials}</div>}
    </div>
  );
}

export default function SpeakersAdmin() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/speakers');
      const arr = res.data?.data || res.data || [];
      setSpeakers(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Load speakers failed', err);
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this speaker?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/speakers/${id}`);
      setSpeakers(s => s.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed — check console');
    } finally {
      setDeletingId(null);
    }
  };

  // inline styles (kept in-file for reliability)
  const container = { color: 'white' };
  const listGrid = { display:'grid', gap:12 };
  const card = { display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:12, borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(178,13,18,0.12)' };
  const leftInfo = { display:'flex', alignItems:'center', gap:12 };
  const nameStyle = { fontWeight:700, color:'white' };
  const meta = { fontSize:13, color:'rgba(255,255,255,0.65)' };
  const addBtn = { textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, background:'#e21b23', color:'black', fontWeight:700 };

  return (
    <div style={container}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>Speakers</h1>

        <Link to="/admin/speakers/new" style={addBtn}>
          + Add Speaker
        </Link>
      </div>

      <div style={listGrid}>
        {loading ? (
          // simple skeletons
          [1,2,3,4].map(i => (
            <div key={i} style={{ ...card }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:24, background:'rgba(255,255,255,0.03)' }} />
                <div style={{ minWidth: 160 }}>
                  <div style={{ width: 140, height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                  <div style={{ height:8 }} />
                  <div style={{ width: 100, height: 10, background:'rgba(255,255,255,0.02)', borderRadius:6 }} />
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <div style={{ width:36, height:36, background:'rgba(255,255,255,0.03)', borderRadius:8 }} />
                <div style={{ width:36, height:36, background:'rgba(255,255,255,0.03)', borderRadius:8 }} />
              </div>
            </div>
          ))
        ) : speakers.length === 0 ? (
          <div style={{ padding:12, borderRadius:8, background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.7)' }}>
            No speakers found.
          </div>
        ) : (
          speakers.map(s => {
            const img = s.photo ? (s.photo.startsWith('http') ? s.photo : apiImagePath(s.photo)) : null;
            return (
              <div key={s._id} style={card}>
                <div style={leftInfo}>
                  <Avatar src={img} name={s.name} size={48} />
                  <div>
                    <div style={nameStyle}>{s.name}</div>
                    <div style={meta}>{[s.designation, s.topic].filter(Boolean).join(' • ')}</div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <Link to={`/admin/speakers/edit/${s._id}`} style={{ textDecoration:'none' }} aria-label={`Edit ${s.name}`} title={`Edit ${s.name}`}>
                    <IconButton title={`Edit ${s.name}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M3 21v-3.75L14.81 5.44a2 2 0 1 1 2.83 2.82L5.83 20.07H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.5 4.5l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </IconButton>
                  </Link>

                  <IconButton
                    title={`Delete ${s.name}`}
                    onClick={() => remove(s._id)}
                    danger
                    disabled={deletingId === s._id}
                  >
                    {deletingId === s._id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </IconButton>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
