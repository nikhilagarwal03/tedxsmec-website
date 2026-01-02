// admin/src/pages/SponsorsAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function apiImagePath(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${base}/${p.replace(/^\/+/, '')}`;
}

export default function SponsorsAdmin() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/sponsors');
      const arr = res.data?.data || res.data || [];
      setSponsors(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Load sponsors failed', err);
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this sponsor?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/sponsors/${id}`);
      setSponsors(s => s.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // inline styles (fallbacks) matching TEDx theme
  const container = { color: 'white' };
  const card = { display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:12, borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(178,13,18,0.12)' };
  const logoBox = { width:96, height:48, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.01)', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)' };
  const nameStyle = { fontWeight:700, color:'white' };
  const subStyle = { fontSize:13, color:'rgba(255,255,255,0.65)' };
  const linkStyle = { textDecoration:'none', padding:'8px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)', color:'white', background:'transparent' };
  const deleteStyle = (busy) => ({ padding:'8px 10px', borderRadius:8, background: busy ? 'rgba(210,40,40,0.75)' : '#e21b23', color:'white', border:'none', cursor:'pointer' });

  return (
    <div style={container}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>Sponsors</h1>

        <Link
          to="/admin/sponsors/new"
          style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, background:'#e21b23', color:'black', fontWeight:700 }}
        >
          + Add Sponsor
        </Link>
      </div>

      <div style={{ display:'grid', gap:12 }}>
        {loading ? (
          // skeletons
          [1,2,3].map(i => (
            <div key={i} style={{ ...card }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:96, height:48, borderRadius:8, background:'rgba(255,255,255,0.03)' }} />
                <div style={{ minWidth: 200 }}>
                  <div style={{ width: 160, height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                  <div style={{ height:8 }} />
                  <div style={{ width: 100, height: 10, background:'rgba(255,255,255,0.02)', borderRadius:6 }} />
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <div style={{ width:64, height:32, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                <div style={{ width:64, height:32, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
              </div>
            </div>
          ))
        ) : sponsors.length === 0 ? (
          <div style={{ padding:12, borderRadius:8, background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.7)' }}>
            No sponsors found.
          </div>
        ) : (
          sponsors.map(sp => {
            const img = sp.logo || sp.logoUrl ? (sp.logo?.startsWith?.('http') ? sp.logo : apiImagePath(sp.logo || sp.logoUrl)) : null;
            return (
              <div key={sp._id} style={card}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  {img ? (
                    <img src={img} alt={sp.name} style={{ width:96, height:48, objectFit:'contain', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)' }} />
                  ) : (
                    <div style={logoBox}>No logo</div>
                  )}

                  <div>
                    <div style={nameStyle}>{sp.name}</div>
                    <div style={subStyle}>{sp.website || '—'}</div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <Link to={`/admin/sponsors/edit/${sp._id}`} style={linkStyle} aria-label={`Edit ${sp.name}`}>
                    Edit
                  </Link>

                  <button onClick={() => remove(sp._id)} disabled={deletingId === sp._id} style={deleteStyle(deletingId === sp._id)} aria-label={`Delete ${sp.name}`}>
                    {deletingId === sp._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
