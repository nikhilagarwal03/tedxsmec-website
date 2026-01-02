// admin/src/pages/OrganizersAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function OrganizersAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/organizers');
      const arr = res.data?.data || res.data || [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Load organizers failed', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this organizer?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/organizers/${id}`);
      setItems(s => s.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const buildImg = (p) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return `${(import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/,'')}/${p.replace(/^\/+/,'')}`;
  };

  // Inline fallback styles that match the TEDx theme (keeps things consistent even without index.css)
  const containerStyle = { color: 'white' };
  const cardStyle = { display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:12, borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(178,13,18,0.12)' };
  const avatarStyle = { width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'1px solid rgba(255,255,255,0.04)' };
  const placeholderAvatar = { width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' };
  const nameStyle = { fontWeight:700, color:'white' };
  const subStyle = { fontSize:13, color:'rgba(255,255,255,0.65)' };
  const btnBase = { padding:'8px 10px', borderRadius:8, border:'none', cursor:'pointer' };
  const editStyle = { ...btnBase, background:'transparent', border:'1px solid rgba(255,255,255,0.06)', color:'white', textDecoration:'none' };
  const deleteStyle = (active) => ({ ...btnBase, background: active ? 'rgba(210,40,40,0.75)' : '#e21b23', color:'white' });

  return (
    <div style={containerStyle}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800 }}>Organizers</h1>

        <Link
          to="/admin/organizers/new"
          className="btn btn-red"
          style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, background:'#e21b23', color:'black', fontWeight:700 }}
        >
          + Add Organizer
        </Link>
      </div>

      <div style={{ display:'grid', gap:12 }}>
        {loading ? (
          // skeleton loaders
          [1,2,3].map(i => (
            <div key={i} style={{ ...cardStyle }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
                <div style={{ minWidth: 180 }}>
                  <div style={{ width: 160, height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                  <div style={{ height:8 }} />
                  <div style={{ width: 120, height: 10, background:'rgba(255,255,255,0.02)', borderRadius:6 }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ width:64, height:32, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                <div style={{ width:64, height:32, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div style={{ padding:12, borderRadius:8, background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.7)' }}>
            No organizers found.
          </div>
        ) : (
          items.map(o => (
            <div key={o._id} style={cardStyle}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {o.photo ? (
                  <img src={buildImg(o.photo)} alt={o.name} style={avatarStyle} />
                ) : (
                  <div style={placeholderAvatar}>{(o.name||'').charAt(0).toUpperCase() || '?'}</div>
                )}

                <div>
                  <div style={nameStyle}>{o.name}</div>
                  <div style={subStyle}>{o.role || '—'}</div>
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <Link to={`/admin/organizers/edit/${o._id}`} style={editStyle} aria-label={`Edit ${o.name}`}>
                  Edit
                </Link>

                <button
                  onClick={() => remove(o._id)}
                  disabled={deletingId === o._id}
                  style={deleteStyle(deletingId === o._id)}
                  aria-label={`Delete ${o.name}`}
                >
                  {deletingId === o._id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
