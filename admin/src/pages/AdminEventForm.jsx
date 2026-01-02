// admin/src/pages/AdminEventForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminEventForm() {
  const { eventId } = useParams();
  const edit = !!eventId;
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    date: '',
    location: '',
    isUpcoming: true,
    price: 0,
    currency: 'INR',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null); // data URL preview
  const [existingBannerUrl, setExistingBannerUrl] = useState(null); // when editing
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const res = await api.get(`/admin/events/${eventId}`);
        const d = res.data?.data || res.data || {};
        setForm({
          name: d.name || '',
          slug: d.slug || '',
          description: d.description || '',
          date: d.date ? new Date(d.date).toISOString().slice(0, 10) : '',
          location: d.location || '',
          isUpcoming:
            d.isUpcoming === true ||
            d.isUpcoming === '1' ||
            d.isUpcoming === 1 ||
            d.isUpcoming === 'true',
          price: d.price !== undefined && d.price !== null ? Number(d.price) : 0,
          currency: d.currency || 'INR',
        });

        // backend uses bannerUrl (normalized by server) — fall back to other keys if needed
        setExistingBannerUrl(d.bannerUrl || d.banner || null);
      } catch (err) {
        console.error('Failed to load event', err);
      }
    })();
  }, [eventId, edit]);

  // generate preview when user selects a file
  useEffect(() => {
    if (!bannerFile) {
      setBannerPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setBannerPreview(e.target.result);
    reader.readAsDataURL(bannerFile);
    return () => {
      // no special cleanup for FileReader
    };
  }, [bannerFile]);

  const submit = async (e) => {
    e.preventDefault();

    // client validation
    if (!form.name.trim()) return alert('Please enter the event name.');
    if (form.date && !/^\d{4}-\d{2}-\d{2}$/.test(form.date)) return alert('Date must be YYYY-MM-DD.');
    if (isNaN(Number(form.price))) return alert('Price must be a number.');

    setLoading(true);
    try {
      const fd = new FormData();
      // append string values; convert booleans and numbers to strings for form-data
      fd.append('name', form.name || '');
      fd.append('slug', form.slug || '');
      fd.append('description', form.description || '');
      fd.append('date', form.date || '');
      fd.append('location', form.location || '');
      fd.append('isUpcoming', form.isUpcoming ? '1' : '0');
      fd.append('price', String(Number(form.price || 0)));
      fd.append('currency', form.currency || 'INR');

      if (bannerFile) fd.append('banner', bannerFile);

      if (edit) {
        await api.put(`/admin/events/${eventId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/events', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      nav('/admin/events');
    } catch (err) {
      console.error(err);
      alert('Save failed — check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // file change handler
  function onFileChangeHandler(e) {
    const f = e.target.files?.[0] ?? null;
    setBannerFile(f);
    if (!f) {
      setBannerPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  return (
    <form onSubmit={submit} className="card" aria-labelledby="event-form-title" style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h2 id="event-form-title" style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'white' }}>
          {edit ? 'Edit' : 'Create'} Event
        </h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-red" disabled={loading} aria-disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>

          <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ color: 'white' }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="muted" style={{ fontSize: 13 }}>
            Name <span style={{ color: '#ff6b6b' }}>*</span>
          </label>
          <input
            className="form-input"
            placeholder="Event name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="muted" style={{ fontSize: 13 }}>
            Slug
          </label>
          <input
            className="form-input"
            placeholder="event-slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="muted" style={{ fontSize: 13 }}>
            Date
          </label>
          <input
            className="form-input"
            placeholder="YYYY-MM-DD"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
            }}
            aria-label="Event date"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label className="muted" style={{ fontSize: 13 }}>
            Location
          </label>
          <input
            className="form-input"
            placeholder="Venue / City"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="muted" style={{ fontSize: 13 }}>
          Description
        </label>
        <textarea
          placeholder="Short description of the event"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'transparent',
            color: 'white',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Banner + preview */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 220 }}>
          <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
            Banner
          </label>
          <input type="file" accept="image/*" onChange={onFileChangeHandler} style={{ color: 'white' }} aria-label="Banner image" />
          <div style={{ marginTop: 8, fontSize: 12 }} className="muted">
            Recommended: 1200x600px
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner preview" style={{ width: 220, height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
          ) : existingBannerUrl ? (
            <img src={existingBannerUrl} alt="Existing banner" style={{ width: 220, height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
          ) : (
            <div style={{ width: 220, height: 110, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.04)' }}>
              No banner
            </div>
          )}
        </div>
      </div>

      {/* price + currency */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 160 }}>
          <label className="muted" style={{ fontSize: 13 }}>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="form-input"
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
              width: '100%',
            }}
          />
        </div>

        <div style={{ minWidth: 120 }}>
          <label className="muted" style={{ fontSize: 13 }}>Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: 'white',
              width: '100%',
            }}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="AED">AED</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <input
            type="checkbox"
            checked={form.isUpcoming}
            onChange={(e) => setForm({ ...form, isUpcoming: e.target.checked })}
            style={{ width: 16, height: 16 }}
            aria-label="Is upcoming"
          />
          <span className="muted">Mark as upcoming</span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button type="submit" className="btn btn-red" disabled={loading}>
          {loading ? 'Saving…' : edit ? 'Update event' : 'Create event'}
        </button>
        <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ color: 'white' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
