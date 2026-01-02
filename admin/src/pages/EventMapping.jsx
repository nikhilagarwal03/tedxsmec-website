// admin/src/pages/EventMapping.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function EventMapping() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [media, setMedia] = useState([]); // global media library
  const [loadingMap, setLoadingMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MEDIA MULTI-SELECT STATE (only media as requested) ---
  const [selectedMediaItems, setSelectedMediaItems] = useState(new Set());
  const toggleSelectMedia = (id) => {
    setSelectedMediaItems(prev => {
      const copy = new Set(prev);
      if (copy.has(String(id))) copy.delete(String(id));
      else copy.add(String(id));
      return copy;
    });
  };
  const clearSelectedMedia = () => setSelectedMediaItems(new Set());
  const selectAllAvailableMedia = (availableIds) => {
    setSelectedMediaItems(new Set(availableIds.map(String)));
  };

  const baseRoot = (p) => {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    return `${(import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '')}/${p.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    if (!eventId) return;
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [evRes, spRes, spnRes, orgRes, coordRes, mediaRes] = await Promise.all([
          api.get(`/admin/events/${eventId}`),
          api.get('/admin/speakers'),
          api.get('/admin/sponsors'),
          api.get('/admin/organizers'),
          api.get('/admin/coordinators'),
          api.get('/admin/media'),
        ]);

        setEvent(evRes.data?.data || evRes.data || null);
        setSpeakers(spRes.data?.data || spRes.data || []);
        setSponsors(spnRes.data?.data || spnRes.data || []);
        setOrganizers(orgRes.data?.data || orgRes.data || []);
        setCoordinators(coordRes.data?.data || coordRes.data || []);
        setMedia(mediaRes.data?.data || mediaRes.data || []);
      } catch (err) {
        console.error('load mapping data error', err);
        setError(err?.response?.data?.message || 'Failed to load mapping data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [eventId]);

  const refreshEvent = async () => {
    try {
      const r = await api.get(`/admin/events/${eventId}`);
      setEvent(r.data?.data || r.data || null);
    } catch (err) {
      console.error('refreshEvent error', err);
    }
  };

  const refreshMedia = async () => {
    try {
      const r = await api.get('/admin/media');
      setMedia(r.data?.data || r.data || []);
    } catch (err) {
      console.error('refreshMedia error', err);
    }
  };

  // Helper: try several payload shapes to avoid 400s from backend expecting different key names
  async function tryMapRequest(actionPath, id) {
    if (!id) throw new Error('Missing media id');

    const attempts = [
      { body: { mediaId: id }, desc: 'mediaId' },
      { body: { id }, desc: 'id' },
      { body: { media: id }, desc: 'media' },
      { body: null, desc: 'url-param' },
    ];

    let lastErr = null;
    for (const attempt of attempts) {
      try {
        if (attempt.body === null) {
          // fallback: append id to path
          const url = actionPath.endsWith('/') ? `${actionPath}${id}` : `${actionPath}/${id}`;
          console.debug('tryMapRequest: trying URL param fallback', url);
          const res = await api.post(url, {});
          return res;
        } else {
          console.debug('tryMapRequest: trying payload key', attempt.desc, attempt.body);
          const res = await api.post(actionPath, attempt.body);
          return res;
        }
      } catch (err) {
        lastErr = err;
        console.warn(`tryMapRequest attempt failed (${attempt.desc}):`, err?.response?.data || err.message || err);
      }
    }

    throw lastErr || new Error('All mapping attempts failed');
  }

  // Generic doAction using tryMapRequest for mapping endpoints
  const doAction = async (actionPath, bodyCandidate) => {
    setLoadingMap(true);
    try {
      if (actionPath.includes('/add-media') || actionPath.includes('/remove-media')) {
        const id = bodyCandidate?.mediaId || bodyCandidate?.id || bodyCandidate?.media;
        await tryMapRequest(actionPath, id);
      } else {
        await api.post(actionPath, bodyCandidate);
      }

      await refreshEvent();
      await refreshMedia();
    } catch (err) {
      console.error('map action failed', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message || 'Action failed';
      alert(`Action failed: ${serverMsg}`);
    } finally {
      setLoadingMap(false);
    }
  };

  // existing single-item actions
  const addSpeaker = (id) => doAction(`/admin/events/${eventId}/add-speaker`, { speakerId: id });
  const removeSpeaker = (id) => doAction(`/admin/events/${eventId}/remove-speaker`, { speakerId: id });

  const addSponsor = (id) => doAction(`/admin/events/${eventId}/add-sponsor`, { sponsorId: id });
  const removeSponsor = (id) => doAction(`/admin/events/${eventId}/remove-sponsor`, { sponsorId: id });

  const addOrganizer = (id) => doAction(`/admin/events/${eventId}/add-organizer`, { organizerId: id });
  const removeOrganizer = (id) => doAction(`/admin/events/${eventId}/remove-organizer`, { organizerId: id });

  const addCoordinator = (id) => doAction(`/admin/events/${eventId}/add-coordinator`, { coordinatorId: id });
  const removeCoordinator = (id) => doAction(`/admin/events/${eventId}/remove-coordinator`, { coordinatorId: id });

  // media mapping wrappers (single-item)
  const addMedia = (id) => doAction(`/admin/events/${eventId}/add-media`, { mediaId: id });
  const removeMedia = (id) => doAction(`/admin/events/${eventId}/remove-media`, { mediaId: id });

  // --- BULK MEDIA ACTIONS (multi-select) ---
  const bulkAddMedia = async (ids = []) => {
    if (!ids || ids.length === 0) return;
    setLoadingMap(true);
    const failures = [];
    try {
      for (const id of ids) {
        try {
          await tryMapRequest(`/admin/events/${eventId}/add-media`, id);
        } catch (err) {
          console.error('bulk add media item failed', id, err);
          failures.push({ id, err });
        }
      }
      await refreshEvent();
      await refreshMedia();
      if (failures.length) alert(`Some items failed to map (${failures.length}). Check console for details.`);
    } finally {
      setLoadingMap(false);
      clearSelectedMedia();
    }
  };

  const bulkRemoveMedia = async (ids = []) => {
    if (!ids || ids.length === 0) return;
    setLoadingMap(true);
    const failures = [];
    try {
      for (const id of ids) {
        try {
          await tryMapRequest(`/admin/events/${eventId}/remove-media`, id);
        } catch (err) {
          console.error('bulk remove media item failed', id, err);
          failures.push({ id, err });
        }
      }
      await refreshEvent();
      await refreshMedia();
      if (failures.length) alert(`Some items failed to unmap (${failures.length}). Check console for details.`);
    } finally {
      setLoadingMap(false);
      clearSelectedMedia();
    }
  };

  if (loading) return <div className="p-4" style={{ color: 'white' }}>Loading mapping data...</div>;
  if (error) return <div className="p-4" style={{ color: '#ff6b6b' }}>Error: {error}</div>;
  if (!event) return <div className="p-4" style={{ color: 'white' }}>Event not found.</div>;

  const mappedIds = (arr) => new Set((arr || []).map(x => String(x._id)));
  const mappedSpeakers = mappedIds(event.speakers);
  const mappedSponsors = mappedIds(event.sponsors);
  const mappedOrganizers = mappedIds(event.organizers);
  const mappedCoordinators = mappedIds(event.coordinators);
  const mappedMedia = mappedIds(event.media);

  const ImgOrPlaceholder = ({ src, alt, size = 40 }) => {
    const url = src ? baseRoot(src) || null : null;
    const sizeStyle = { width: size, height: size, borderRadius: '50%' };
    if (!url) {
      return <div style={{ ...sizeStyle, background: 'rgba(255,255,255,0.03)' }} aria-hidden />;
    }
    return <img src={url} alt={alt || ''} style={{ ...sizeStyle, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.04)' }} />;
  };

  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(178,13,18,0.18)', padding: 12, borderRadius: 10, color: 'white' };
  const itemStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' };
  const actionBtn = (bg = '#e21b23') => ({ padding: '6px 10px', borderRadius: 8, background: bg, color: 'white', border: 'none', cursor: 'pointer' });
  const addOutline = { padding: '6px 10px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(178,13,18,0.6)', color: 'white', cursor: 'pointer' };
  const removeBtnStyle = actionBtn('#e21b23');

  const MediaThumb = ({ item, size = 72 }) => {
    if (!item) return <div style={{ width: size, height: size, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }} />;
    const type = typeof item.type === 'string' ? item.type.toLowerCase() : (item.url && item.url.includes('youtube') ? 'video' : 'image');
    if (type === 'image') {
      const imgPath = item.url || item.path || item.filePath || item.logo || item.logoUrl || null;
      const imgUrl = imgPath ? baseRoot(imgPath) : null;
      if (imgUrl) {
        return <img src={imgUrl} alt={item.title || ''} style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }} />;
      }
      return <div style={{ width: size, height: size, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }} />;
    }

    const url = item.url || '';
    const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (m) {
      const thumb = `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
      return <img src={thumb} alt={item.title || ''} style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }} />;
    }

    return <div style={{ width: size, height: size, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }} />;
  };

  const safeTypeLabel = (m) => {
    if (!m) return 'UNKNOWN';
    const t = typeof m.type === 'string' ? m.type : (m.url && m.url.includes('youtube') ? 'video' : 'image');
    return String(t).toUpperCase();
  };

  // available media IDs for select-all convenience
  const availableMedia = Array.isArray(media) ? media.filter(m => !mappedMedia.has(String(m._id))) : [];
  const availableMediaIds = availableMedia.map(m => String(m._id));

  return (
    <div className="space-y-6 p-4" style={{ color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Map resources for: {event.name}</h1>
        <Link to="/admin/events" className="btn btn-outline" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: 8, textDecoration: 'none' }}>
          Back to events
        </Link>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {/* Speakers */}
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Speakers</h2>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Mapped</div>
            {Array.isArray(event.speakers) && event.speakers.length ? event.speakers.map(s => (
              <div key={s._id || `speaker-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={s.photo || s.avatar} alt={s.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.topic || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => removeSpeaker(s._id)} style={removeBtnStyle}>Remove</button>
              </div>
            )) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No speakers mapped.</div>}
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Available</div>
            {Array.isArray(speakers) && speakers.filter(s => !mappedSpeakers.has(String(s._id))).map(s => (
              <div key={s._id || `speaker-av-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={s.photo || s.avatar} alt={s.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.topic || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => addSpeaker(s._id)} style={addOutline}>Add</button>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsors */}
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Sponsors</h2>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Mapped</div>
            {Array.isArray(event.sponsors) && event.sponsors.length ? event.sponsors.map(sp => (
              <div key={sp._id || `sponsor-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {sp.logo || sp.logoUrl ? (
                    <img src={baseRoot(sp.logo || sp.logoUrl)} alt={sp.name} style={{ width: 100, height: 40, objectFit: 'contain' }} />
                  ) : <div style={{ width: 100, height: 40, background: 'rgba(255,255,255,0.03)' }} />}
                  <div>
                    <div style={{ fontWeight: 700 }}>{sp.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sp.website || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => removeSponsor(sp._id)} style={removeBtnStyle}>Remove</button>
              </div>
            )) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No sponsors mapped.</div>}
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Available</div>
            {Array.isArray(sponsors) && sponsors.filter(sp => !mappedSponsors.has(String(sp._id))).map(sp => (
              <div key={sp._id || `sponsor-av-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {sp.logo || sp.logoUrl ? (
                    <img src={baseRoot(sp.logo || sp.logoUrl)} alt={sp.name} style={{ width: 100, height: 40, objectFit: 'contain' }} />
                  ) : <div style={{ width: 100, height: 40, background: 'rgba(255,255,255,0.03)' }} />}
                  <div>
                    <div style={{ fontWeight: 700 }}>{sp.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sp.website || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => addSponsor(sp._id)} style={addOutline}>Add</button>
              </div>
            ))}
          </div>
        </section>

        {/* Organizers */}
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Organizers</h2>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Mapped</div>
            {Array.isArray(event.organizers) && event.organizers.length ? event.organizers.map(o => (
              <div key={o._id || `org-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={o.photo} alt={o.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{o.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{o.role || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => removeOrganizer(o._id)} style={removeBtnStyle}>Remove</button>
              </div>
            )) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No organizers mapped.</div>}
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Available</div>
            {Array.isArray(organizers) && organizers.filter(o => !mappedOrganizers.has(String(o._id))).map(o => (
              <div key={o._id || `org-av-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={o.photo} alt={o.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{o.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{o.role || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => addOrganizer(o._id)} style={addOutline}>Add</button>
              </div>
            ))}
          </div>
        </section>

        {/* Coordinators */}
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Faculty Coordinators</h2>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Mapped</div>
            {Array.isArray(event.coordinators) && event.coordinators.length ? event.coordinators.map(c => (
              <div key={c._id || `coord-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={c.photo} alt={c.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.department || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => removeCoordinator(c._id)} style={removeBtnStyle}>Remove</button>
              </div>
            )) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No coordinators mapped.</div>}
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Available</div>
            {Array.isArray(coordinators) && coordinators.filter(c => !mappedCoordinators.has(String(c._id))).map(c => (
              <div key={c._id || `coord-av-${Math.random()}`} style={itemStyle}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ImgOrPlaceholder src={c.photo} alt={c.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.department || ''}</div>
                  </div>
                </div>
                <button disabled={loadingMap} onClick={() => addCoordinator(c._id)} style={addOutline}>Add</button>
              </div>
            ))}
          </div>
        </section>

        {/* Media (with multi-select) */}
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>Media (Images & YouTube)</h2>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Mapped</div>
            {Array.isArray(event.media) && event.media.length ? (
              <>
                {event.media.map(m => {
                  const id = String(m._id);
                  const isSelected = selectedMediaItems.has(id);
                  return (
                    <div key={id} style={itemStyle}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectMedia(id)}
                        />
                        <MediaThumb item={m} size={72} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{m.title || (m.type === 'video' ? 'YouTube video' : 'Image')}</div>
                          <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{safeTypeLabel(m)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {String((m.type || '')).toLowerCase() === 'video' && m.url && (
                          <a href={m.url} target="_blank" rel="noreferrer" className="ml-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'white', padding: '6px 10px', borderRadius: 8 }}>Open</a>
                        )}
                        <button disabled={loadingMap} onClick={() => removeMedia(m._id)} style={removeBtnStyle}>Unmap</button>
                      </div>
                    </div>
                  );
                })}

                {selectedMediaItems.size > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      disabled={loadingMap}
                      onClick={() => bulkRemoveMedia([...selectedMediaItems])}
                      style={{ ...actionBtn('#e21b23'), flex: 1 }}
                    >
                      Unmap {selectedMediaItems.size} Selected
                    </button>
                    <button
                      disabled={loadingMap}
                      onClick={() => clearSelectedMedia()}
                      style={{ ...addOutline, flex: 0 }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </>
            ) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No media mapped.</div>}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>Available</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                {availableMedia.length} available
                {availableMedia.length > 0 && (
                  <button
                    onClick={() => selectAllAvailableMedia(availableMediaIds)}
                    style={{ marginLeft: 10, padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                  >
                    Select all
                  </button>
                )}
              </div>
            </div>

            {availableMedia.length ? (
              <>
                {availableMedia.map(m => {
                  const id = String(m._id);
                  const isSelected = selectedMediaItems.has(id);
                  return (
                    <div key={id} style={itemStyle}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectMedia(id)}
                        />
                        <MediaThumb item={m} size={72} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{m.title || (m.type === 'video' ? 'YouTube video' : 'Image')}</div>
                          <div className="muted" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{safeTypeLabel(m)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {String((m.type || '')).toLowerCase() === 'video' && m.url && (
                          <a href={m.url} target="_blank" rel="noreferrer" className="ml-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'white', padding: '6px 10px', borderRadius: 8 }}>Open</a>
                        )}
                        <button disabled={loadingMap} onClick={() => addMedia(m._id)} style={addOutline}>Map</button>
                      </div>
                    </div>
                  );
                })}

                {selectedMediaItems.size > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      disabled={loadingMap}
                      onClick={() => bulkAddMedia([...selectedMediaItems])}
                      style={{ ...actionBtn('#22a55a'), flex: 1 }}
                    >
                      Map {selectedMediaItems.size} Selected
                    </button>
                    <button
                      disabled={loadingMap}
                      onClick={() => clearSelectedMedia()}
                      style={{ ...addOutline, flex: 0 }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </>
            ) : <div className="muted" style={{ color: 'rgba(255,255,255,0.6)' }}>No media available.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}

