
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function CoordinatorsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/coordinators');
      const arr = res.data?.data || res.data || [];
      setList(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Failed to load coordinators', err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this coordinator?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/coordinators/${id}`);
      setList(s => s.filter(x => x._id !== id));
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
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api')
      .replace(/\/api\/?$/, '');
    return `${base}/${p.replace(/^\/+/, '')}`;
  };

  return (
    <div style={{ color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Faculty Coordinators</h1>
        <Link
          to="/admin/coordinators/new"
          className="btn btn-red"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontWeight: 700 }}>+</span> Add Coordinator
        </Link>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{minWidth:180}}>
                  <div style={{ width: 160, height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
                  <div style={{ width: 120, height: 10, background: 'rgba(255,255,255,0.02)', marginTop:8, borderRadius:6 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 64, height: 32, background: 'rgba(255,255,255,0.04)', borderRadius:6 }} />
                <div style={{ width: 64, height: 32, background: 'rgba(255,255,255,0.04)', borderRadius:6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {list.length === 0 ? (
            <div className="muted" style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
              No coordinators found.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))'
            }}>
              {/* For larger screens, show as two columns */}
              <style>{`
                @media (min-width: 768px) {
                  .coordinator-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
              `}</style>

              <div className="coordinator-grid" style={{ display: 'grid', gap: 12 }}>
                {list.map(c => (
                  <div key={c._id} className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {c.photo ? (
                        <img
                          src={buildImg(c.photo)}
                          alt={c.name}
                          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.04)' }}
                        />
                      ) : (
                        <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}>
                          { (c.name||'').charAt(0).toUpperCase() || '?' }
                        </div>
                      )}

                      <div>
                        <div style={{ fontWeight: 700, color: 'white' }}>{c.name}</div>
                        <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.department || '—'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={`/admin/coordinators/edit/${c._id}`}
                        className="btn btn-outline"
                        style={{ textDecoration: 'none', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', color: 'white' }}
                        aria-label={`Edit ${c.name}`}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => remove(c._id)}
                        className="btn btn-red"
                        disabled={deletingId === c._id}
                        style={{ padding: '8px 10px', borderRadius: 8, background: deletingId===c._id ? 'rgba(210,40,40,0.7)' : undefined }}
                        aria-label={`Delete ${c.name}`}
                      >
                        {deletingId === c._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
