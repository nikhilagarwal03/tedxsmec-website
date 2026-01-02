// admin/src/pages/EventsAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function apiImagePath(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${base}/${p.replace(/^\/+/, '')}`;
}

/* Small IconButton used for action icons */
function IconButton({ title, onClick, children, danger = false, disabled = false }) {
  return (
    <button
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
        background: danger ? (disabled ? 'rgba(210,30,30,0.65)' : 'rgba(210,30,30,0.95)') : 'transparent',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 6,
      }}
    >
      {children}
    </button>
  );
}

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/events');
      const arr = res.data?.data || res.data || [];
      setEvents(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Load events failed', err);
      alert('Failed to load events (see console)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete event?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(e => e.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed — check console');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ color: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Events</h1>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/events/new" className="btn btn-red" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
            <span style={{ fontWeight:800 }}>+</span> Create Event
          </Link>

          <button
            onClick={load}
            className="btn btn-outline"
            style={{
              padding:'8px 12px',
              borderRadius:8,
              border:'1px solid rgba(255,255,255,0.06)',
              background:'transparent',
              color:'white'
            }}
            aria-label="Refresh events"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content card */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(178,13,18,0.18)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Table header (hidden on very small screens) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 160px 140px 120px 140px',
            gap: 12,
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            alignItems: 'center'
          }}
          className="hidden-sm"
        >
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight:700 }}>Banner</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight:700 }}>Name</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight:700 }}>Slug</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight:700 }}>Price</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight:700 }}>Date</div>
          <div style={{ textAlign:'right', fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>Actions</div>
        </div>

        {/* List */}
        <div style={{ display: 'grid', gap: 0 }}>
          {loading ? (
            // skeletons
            Array.from({length:4}).map((_,i) => (
              <div key={i} className="ev-row" style={{ display:'grid', gridTemplateColumns:'120px 1fr 160px 140px 120px 140px', gap:12, padding:'12px 16px', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ width: 120, height: 60, borderRadius: 6, background:'rgba(255,255,255,0.03)' }} />
                <div>
                  <div style={{ width: '60%', height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                  <div style={{ height:8 }} />
                  <div style={{ width: '40%', height: 10, background:'rgba(255,255,255,0.02)', borderRadius:6 }} />
                </div>
                <div style={{ width: 160, height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                <div style={{ width: 140, height: 12, background:'rgba(255,255,255,0.03)', borderRadius:6 }} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <div style={{ width:36, height:36, background:'rgba(255,255,255,0.03)', borderRadius:8 }} />
                  <div style={{ width:36, height:36, background:'rgba(255,255,255,0.03)', borderRadius:8 }} />
                </div>
              </div>
            ))
          ) : events.length === 0 ? (
            <div style={{ padding:16, color:'rgba(255,255,255,0.7)' }}>No events found</div>
          ) : (
            events.map(ev => {
              const priceDisplay = (ev.price === undefined || ev.price === null || ev.price === '') ? 'Free' : `${ev.currency || 'INR'} ${Number(ev.price).toFixed(2)}`;
              return (
                <div
                  key={ev._id}
                  className="ev-row"
                  style={{
                    display:'grid',
                    gridTemplateColumns:'120px 1fr 160px 140px 120px 140px',
                    gap:12,
                    padding:'12px 16px',
                    alignItems:'center',
                    borderBottom:'1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {/* Banner */}
                  <div>
                    {ev.bannerUrl ? (
                      <img
                        src={ev.bannerUrl.startsWith('http') ? ev.bannerUrl : apiImagePath(ev.bannerUrl)}
                        alt={`${ev.name} banner`}
                        style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}
                      />
                    ) : (
                      <div style={{ width: 120, height: 60, borderRadius: 6, background:'rgba(255,255,255,0.02)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.35)' }}>No image</div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'white' }}>{ev.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{ev.description ? ev.description.slice(0, 120) : ''}</div>
                  </div>

                  {/* Slug */}
                  <div style={{ color: 'rgba(255,255,255,0.8)', wordBreak: 'break-word' }}>
                    {ev.slug || '—'}
                  </div>

                  {/* Price */}
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight:700 }}>
                    {priceDisplay}
                  </div>

                  {/* Date */}
                  <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {ev.date ? new Date(ev.date).toLocaleString() : 'TBA'}
                  </div>

                  {/* Actions (icons) */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    {/* Edit (pencil) */}
                    <Link to={`/admin/events/edit/${ev._id}`} style={{ textDecoration:'none' }}>
                      <IconButton title={`Edit ${ev.name}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M3 21v-3.75L14.81 5.44a2 2 0 1 1 2.83 2.82L5.83 20.07H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.5 4.5l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </IconButton>
                    </Link>

                    {/* Map (pin) */}
                    <Link to={`/admin/events/map/${ev._id}`} style={{ textDecoration:'none' }}>
                      <IconButton title={`Map resources for ${ev.name}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M12 21s8-5.5 8-11a8 8 0 1 0-16 0c0 5.5 8 11 8 11z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </IconButton>
                    </Link>

                    {/* Map by slug (link icon) */}
                    {ev.slug ? (
                      <Link to={`/admin/events/map/slug/${encodeURIComponent(ev.slug)}`} style={{ textDecoration:'none' }}>
                        <IconButton title={`Map (slug: ${ev.slug})`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M10 14a3 3 0 0 1 0-4l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 10a3 3 0 0 1 0 4l-1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 17l-1 1a3 3 0 0 1-4-4l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 7l1-1a3 3 0 0 1 4 4l-1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </IconButton>
                      </Link>
                    ) : null}

                    {/* Delete (trash) */}
                    <IconButton
                      title={`Delete ${ev.name}`}
                      onClick={() => remove(ev._id)}
                      danger
                      disabled={deleting === ev._id}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </IconButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Responsive rules: stack columns into cards on small screens */}
      <style>{`
        @media (max-width:820px) {
          .hidden-sm { display: none; }
          .ev-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            padding: 12px !important;
            grid-auto-rows: auto;
          }
          .ev-row > div:nth-child(1) { order: 1; } /* image */
          .ev-row > div:nth-child(2) { order: 2; } /* name/desc */
          .ev-row > div:nth-child(3) { order: 3; } /* slug */
          .ev-row > div:nth-child(4) { order: 4; } /* price */
          .ev-row > div:nth-child(5) { order: 5; } /* date */
          .ev-row > div:nth-child(6) { order: 6; display:flex; justify-content:flex-end; gap:8px; } /* actions */
        }
      `}</style>
    </div>
  );
}
