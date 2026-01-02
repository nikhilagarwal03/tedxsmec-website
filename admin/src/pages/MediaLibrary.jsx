// admin/src/pages/MediaLibrary.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import MediaCard from '../components/MediaCard';

/**
 * MediaLibrary page (multi-upload + map feature)
 * - Upload multiple images (each file uploaded as single multipart request to backend)
 * - Add multiple YouTube links (paste links, one per line)
 * - Optionally map uploaded/added media directly to an event when ?eventId=... present
 * - Edit title/description, delete, and map/unmap existing items as before
 * - Library now shows Images and Videos separately with thumbnails
 */

function extractYouTubeId(url) {
  if (!url) return null;
  const re = /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = url.match(re);
  return m ? m[1] : null;
}

// resolve relative paths returned by your API
function baseRoot(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  const root = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${root}/${String(p).replace(/^\/+/, '')}`;
}

export default function MediaLibrary() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // upload form (now supports multiple files)
  const [imageFiles, setImageFiles] = useState([]); // array of File
  const [imageTitle, setImageTitle] = useState(''); // applied to each file as default title
  const [imageDesc, setImageDesc] = useState('');
  const [mapOnUpload, setMapOnUpload] = useState(Boolean(eventId)); // checkbox: map to event after upload

  // video form (supports multiple links, one per line)
  const [videoLinksText, setVideoLinksText] = useState(''); // newline separated links
  const [videoTitle, setVideoTitle] = useState(''); // default title
  const [videoDesc, setVideoDesc] = useState('');

  // edit
  const [editing, setEditing] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  // event mapping ids (for quick toggle state)
  const [eventMediaIds, setEventMediaIds] = useState(new Set());

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (eventId) loadEventMediaIds();
    else setEventMediaIds(new Set());
  }, [eventId, busy]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/media');
      const arr = res.data?.data || res.data || [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Load failed');
    } finally { setLoading(false); }
  }

  async function loadEventMediaIds() {
    try {
      const r = await api.get(`/admin/events/${eventId}`);
      const ev = r.data?.data || r.data || null;
      const ids = new Set((ev?.media||[]).map(x => String(x._id || x.id)));
      setEventMediaIds(ids);
    } catch (err) { setEventMediaIds(new Set()); }
  }

  // Upload multiple image files — send each file as a separate multipart request
  async function uploadImage(e) {
    e?.preventDefault();
    if (!imageFiles || imageFiles.length === 0) { alert('Select one or more images'); return; }
    setBusy(true);
    try {
      const createdIds = [];
      for (const file of imageFiles) {
        const fd = new FormData();
        fd.append('type', 'image');
        fd.append('title', imageTitle || file.name);
        fd.append('description', imageDesc || '');
        fd.append('file', file); // single file per request (robust)
        const res = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const created = res.data?.data || res.data;
        let createdItem = null;
        if (Array.isArray(created)) createdItem = created[0] || null;
        else if (created && typeof created === 'object') createdItem = created;
        if (createdItem) createdIds.push(String(createdItem._id || createdItem.id || createdItem._doc?._id));
      }

      // optionally map newly created media to event
      if (mapOnUpload && eventId && createdIds.length) {
        for (const mid of createdIds) {
          try {
            await api.post(`/admin/events/${eventId}/add-media`, { mediaId: mid });
          } catch (err) {
            console.warn('map after upload failed for', mid, err?.response?.data || err.message || err);
          }
        }
      }

      // reset form
      setImageFiles([]);
      setImageTitle('');
      setImageDesc('');
      await loadAll();
      if (eventId) await loadEventMediaIds();
      alert('Upload completed');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Upload failed');
    } finally { setBusy(false); }
  }

  // Add multiple YouTube links (one per line)
  async function addVideos(e) {
    e?.preventDefault();
    const lines = (videoLinksText || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) { alert('Paste one or more YouTube links (one per line)'); return; }

    setBusy(true);
    try {
      const createdIds = [];
      for (const line of lines) {
        const vid = extractYouTubeId(line);
        if (!vid) {
          console.warn('skipping invalid youtube link:', line);
          continue;
        }
        const normalized = `https://www.youtube.com/watch?v=${vid}`;
        const payload = { type: 'video', title: videoTitle || '', description: videoDesc || '', url: normalized };
        const res = await api.post('/admin/media', payload);
        const created = res.data?.data || res.data;
        let createdItem = null;
        if (Array.isArray(created)) createdItem = created[0] || null;
        else if (created && typeof created === 'object') createdItem = created;
        if (createdItem) createdIds.push(String(createdItem._id || createdItem.id));
      }

      // optionally map newly created videos to event
      if (mapOnUpload && eventId && createdIds.length) {
        for (const mid of createdIds) {
          try {
            await api.post(`/admin/events/${eventId}/add-media`, { mediaId: mid });
          } catch (err) {
            console.warn('map after add video failed for', mid, err?.response?.data || err.message || err);
          }
        }
      }

      setVideoLinksText('');
      setVideoTitle('');
      setVideoDesc('');
      await loadAll();
      if (eventId) await loadEventMediaIds();
      alert('Videos added');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Add failed');
    } finally { setBusy(false); }
  }

  function startEdit(item) {
    setEditing(item);
    setEditingTitle(item.title || '');
    setEditingDesc(item.description || '');
  }

  async function saveEdit() {
    if (!editing) return;
    setBusy(true);
    try {
      await api.put(`/admin/media/${editing._id || editing.id}`, { title: editingTitle, description: editingDesc });
      setEditing(null);
      await loadAll();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Save failed');
    } finally { setBusy(false); }
  }

  async function deleteMedia(item) {
    if (!confirm('Delete this media from library?')) return;
    setBusy(true);
    try {
      await api.delete(`/admin/media/${item._id || item.id}`);
      await loadAll();
      if (eventId) await loadEventMediaIds();
      alert('Deleted');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    } finally { setBusy(false); }
  }

  async function toggleMap(item) {
    if (!eventId) { alert('Open this page with ?eventId=<id> to map directly.'); return; }
    setBusy(true);
    try {
      const id = String(item._id || item.id);
      if (eventMediaIds.has(id)) {
        await api.post(`/admin/events/${eventId}/remove-media`, { mediaId: id });
        alert('Unmapped');
      } else {
        await api.post(`/admin/events/${eventId}/add-media`, { mediaId: id });
        alert('Mapped');
      }
      await loadEventMediaIds();
      await loadAll();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Map action failed');
    } finally { setBusy(false); }
  }

  // UX helper: file input change (multiple)
  function onImageFilesChange(e) {
    const list = Array.from(e.target.files || []);
    setImageFiles(list);
  }

  // separate images and videos (fallback: infer from url/type)
  const images = items.filter(it => (it.type === 'image') || (!it.type && (it.url || '').match(/\.(jpe?g|png|gif|webp|svg)$/i)));
  const videos = items.filter(it => (it.type === 'video') || (!it.type && extractYouTubeId(it.url || (it.path || ''))));

  // helper to produce display thumbnail for an item
  function thumbUrl(it) {
    if (!it) return null;
    if ((it.type === 'video' || extractYouTubeId(it.url || ''))) {
      const id = extractYouTubeId(it.url || '');
      if (!id) return null;
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    // image: use url or common fields
    const candidate = it.url || it.path || it.src || it.file || it.filename || it.storagePath;
    return baseRoot(candidate);
  }

  return (
    <div className="ml-page">
      <div className="ml-row">
        <h1 className="ml-h1">Media Library</h1>
        <div>
          <Link to="/admin/events" className="ml-btn-outline">Events</Link>
          <a href="/admin/media" className="ml-btn-outline" style={{ marginLeft: 8 }}>Library</a>
        </div>
      </div>

      <div className="ml-grid">
        {/* Image upload */}
        <form className="ml-card" onSubmit={uploadImage}>
          <div className="ml-card-head">Upload Images (multiple)</div>

          <input
            className="ml-input"
            placeholder="Default title for these images (optional)"
            value={imageTitle}
            onChange={e => setImageTitle(e.target.value)}
          />
          <input
            className="ml-input"
            placeholder="Default description (optional)"
            value={imageDesc}
            onChange={e => setImageDesc(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImageFilesChange}
            className="ml-file"
          />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
            Selected: {imageFiles.length} file(s)
          </div>

          {eventId && (
            <label style={{ display: 'block', marginBottom: 8 }}>
              <input type="checkbox" checked={mapOnUpload} onChange={e => setMapOnUpload(e.target.checked)} />{' '}
              Map uploaded media to event (eventId={eventId})
            </label>
          )}

          <div className="ml-actions-row">
            <button className="ml-btn-primary" disabled={busy}>{busy ? 'Working…' : 'Upload & Save'}</button>
            <button
              type="button"
              className="ml-btn-outline"
              onClick={() => { setImageFiles([]); setImageTitle(''); setImageDesc(''); }}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Video add (multiple links) */}
        <form className="ml-card" onSubmit={addVideos}>
          <div className="ml-card-head">Add YouTube Links (multiple)</div>

          <textarea
            className="ml-input"
            placeholder="Paste one YouTube link per line"
            value={videoLinksText}
            onChange={e => setVideoLinksText(e.target.value)}
            style={{ minHeight: 100 }}
          />
          <input
            className="ml-input"
            placeholder="Default title for these videos (optional)"
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
          />
          <input
            className="ml-input"
            placeholder="Default description (optional)"
            value={videoDesc}
            onChange={e => setVideoDesc(e.target.value)}
          />

          {eventId && (
            <label style={{ display: 'block', marginBottom: 8 }}>
              <input type="checkbox" checked={mapOnUpload} onChange={e => setMapOnUpload(e.target.checked)} />{' '}
              Map added videos to event (eventId={eventId})
            </label>
          )}

          <div className="ml-actions-row">
            <button className="ml-btn-primary" disabled={busy}>{busy ? 'Working…' : 'Add Video(s)'}</button>
            <button type="button" className="ml-btn-outline" onClick={() => { setVideoLinksText(''); setVideoTitle(''); setVideoDesc(''); }}>Clear</button>
          </div>
        </form>
      </div>

      {editing && (
        <div className="ml-card" style={{ marginTop: 12 }}>
          <div className="ml-card-head">Edit media</div>
          <input className="ml-input" value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
          <textarea className="ml-input" style={{ minHeight: 80 }} value={editingDesc} onChange={e => setEditingDesc(e.target.value)} />
          <div className="ml-actions-row">
            <button className="ml-btn-primary" onClick={saveEdit} disabled={busy}>Save</button>
            <button className="ml-btn-outline" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="ml-card" style={{ marginTop: 12 }}>
        <div className="ml-card-head">Images ({images.length})</div>

        {loading ? <div className="ml-muted">Loading…</div> : images.length === 0 ? <div className="ml-muted">No images yet.</div> : (
          <div className="ml-list">
            {images.map(it => {
              const t = thumbUrl(it);
              return (
                <div key={String(it._id || it.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ width: 84, height: 56, background: 'rgba(255,255,255,0.03)', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t ? <img src={t} alt={it.title || 'image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>No preview</div>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{it.title || it.filename || it.name || 'Untitled image'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{it.description || (it.url || '')}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="ml-btn-outline" onClick={() => window.open(it.url || baseRoot(it.url || it.path), '_blank')}>Open</button>
                    <button className="ml-btn-outline" onClick={() => startEdit(it)}>Edit</button>
                    <button className="ml-btn-outline" onClick={() => deleteMedia(it)}>Delete</button>
                    {eventId && <button className="ml-btn-primary" onClick={() => toggleMap(it)} disabled={busy}>{eventMediaIds.has(String(it._id || it.id)) ? 'Unmap' : 'Map'}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="ml-card" style={{ marginTop: 12 }}>
        <div className="ml-card-head">Videos ({videos.length})</div>

        {loading ? <div className="ml-muted">Loading…</div> : videos.length === 0 ? <div className="ml-muted">No videos yet.</div> : (
          <div className="ml-list">
            {videos.map(it => {
              const id = extractYouTubeId(it.url || (it.path || '')) || null;
              const t = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
              return (
                <div key={String(it._id || it.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ width: 140, height: 78, background: 'rgba(255,255,255,0.03)', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t ? <img src={t} alt={it.title || 'video'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>No preview</div>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{it.title || 'Untitled video'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{it.description || it.url}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="ml-btn-outline" onClick={() => window.open(it.url, '_blank')}>Open</button>
                    <button className="ml-btn-outline" onClick={() => startEdit(it)}>Edit</button>
                    <button className="ml-btn-outline" onClick={() => deleteMedia(it)}>Delete</button>
                    {eventId && <button className="ml-btn-primary" onClick={() => toggleMap(it)} disabled={busy}>{eventMediaIds.has(String(it._id || it.id)) ? 'Unmap' : 'Map'}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <div className="ml-error">{error}</div>}
    </div>
  );
}
