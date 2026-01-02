// admin/src/pages/OrganizerForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function OrganizerForm() {
  const { organizerId } = useParams();
  const edit = !!organizerId;
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    role: '',
    linkedin: '',
    twitter: '',
    bio: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // helper: convert backend relative path (uploads/...) to absolute URL if needed
  const qualifyUrl = (p) => {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/i, '');
    return `${base}/${p.replace(/^\/+/, '')}`;
  };

  // load existing organizer when editing
  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const r = await api.get(`/admin/organizers/${organizerId}`);
        const d = r.data?.data || r.data || {};
        setForm({
          name: d.name || '',
          role: d.role || '',
          linkedin: (d.socialLinks && d.socialLinks.linkedin) || d.linkedin || '',
          twitter: (d.socialLinks && d.socialLinks.twitter) || d.twitter || '',
          bio: d.bio || ''
        });

        // prefer photo, fallbacks: imageUrl, image
        const rawPhoto = d.photo || d.imageUrl || d.image || null;
        if (rawPhoto) {
          setExistingPhotoUrl(qualifyUrl(rawPhoto));
        } else {
          setExistingPhotoUrl(null);
        }
      } catch (err) {
        console.error('Load organizer failed', err);
      }
    })();
  }, [organizerId, edit]);

  // preview selected photo (local file)
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photo);
  }, [photo]);

  // single handler for file input
  const handlePhotoSelect = (e) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert('Please enter a name.');
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v ?? ''));
      if (photo) data.append('photo', photo);

      if (edit) {
        await api.put(`/admin/organizers/${organizerId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/organizers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      nav('/admin/organizers');
    } catch (err) {
      console.error(err);
      alert('Save failed — check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 900, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'white' }}>{edit ? 'Edit' : 'Add'} Organizer</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-red" disabled={loading} aria-disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ color: 'white' }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12 }}>
        {/* Left: inputs */}
        <div>
          <div style={{ display: 'grid', gap: 10 }}>
            <label className="muted" style={{ fontSize: 13 }}>Name <span style={{ color: '#ff6b6b' }}>*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Full name"
              style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white' }}
            />

            <label className="muted" style={{ fontSize: 13 }}>Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Role (e.g. Lead / Coordinator)"
              style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="muted" style={{ fontSize: 13 }}>LinkedIn</label>
                <input
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white' }}
                />
              </div>

              <div>
                <label className="muted" style={{ fontSize: 13 }}>Twitter</label>
                <input
                  value={form.twitter}
                  onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                  placeholder="Twitter handle"
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white' }}
                />
              </div>
            </div>

            <label className="muted" style={{ fontSize: 13 }}>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={5}
              placeholder="Short bio"
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'white', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Right: photo */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="muted" style={{ fontSize: 13 }}>Photo</div>
            <div className="muted" style={{ fontSize: 12 }}>120x120px</div>
          </div>

          <label style={{ display: 'block' }}>
            <input type="file" accept="image/*" onChange={handlePhotoSelect} style={{ color: 'white' }} />
          </label>

          <div style={{ marginTop: 6 }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
            ) : existingPhotoUrl ? (
              <img src={existingPhotoUrl} alt="Existing" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
            ) : (
              <div style={{ width: '100%', height: 240, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.04)' }}>
                No photo
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Footer actions for smaller screens */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
        <button type="submit" className="btn btn-red" disabled={loading}>
          {loading ? 'Saving…' : edit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ color: 'white' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
