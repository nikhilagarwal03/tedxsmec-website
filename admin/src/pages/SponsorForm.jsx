// admin/src/pages/SponsorForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function SponsorForm() {
  const { sponsorId } = useParams();
  const edit = !!sponsorId;
  const nav = useNavigate();

  const [form, setForm] = useState({ name: '', website: '', description: '' });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // helper: convert backend relative path to absolute URL if needed
  const qualifyUrl = (p) => {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/i, '');
    return `${base}/${p.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const r = await api.get(`/admin/sponsors/${sponsorId}`);
        const d = r.data?.data || r.data || {};

        setForm({
          name: d.name || '',
          website: d.website || '',
          description: d.description || ''
        });

        // prefer common keys: logo, imageUrl, image, logoUrl
        const rawLogo = d.logo || d.imageUrl || d.image || d.logoUrl || null;
        if (rawLogo) {
          setExistingLogoUrl(qualifyUrl(rawLogo));
        } else {
          setExistingLogoUrl(null);
        }
      } catch (err) {
        console.error('Load sponsor failed', err);
      }
    })();
  }, [sponsorId, edit]);

  // create preview when user selects a logo file
  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(logo);
  }, [logo]);

  const handleLogoSelect = (e) => {
    const f = e.target.files?.[0] ?? null;
    setLogo(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Please enter sponsor name.');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (logo) fd.append('logo', logo);

      if (edit) {
        await api.put(`/admin/sponsors/${sponsorId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/sponsors', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      nav('/admin/sponsors');
    } catch (err) {
      console.error(err);
      alert('Save failed — check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // inline style fallbacks to match TEDx theme (works even without index.css)
  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(178,13,18,0.12)', padding: 16, borderRadius: 12, color: 'white' };
  const inputStyle = { padding: 10, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'white' };
  const labelMuted = { fontSize: 13, color: 'rgba(255,255,255,0.8)' };

  return (
    <form onSubmit={submit} className="card" style={{ ...cardStyle, maxWidth: 900, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{edit ? 'Edit' : 'Add'} Sponsor</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-red" disabled={loading} style={{ padding: '8px 12px', borderRadius: 8 }}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ padding: '8px 12px', borderRadius: 8, color: 'white', border: '1px solid rgba(255,255,255,0.06)' }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12 }}>
        <div>
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={labelMuted}>Name <span style={{ color: '#ff6b6b' }}>*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sponsor name"
              required
              style={inputStyle}
            />

            <label style={labelMuted}>Website</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://example.com"
              style={inputStyle}
            />

            <label style={labelMuted}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Short description"
              style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
            />
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={labelMuted}>Logo</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Recommend: 300×120</div>
          </div>

          <label style={{ display: 'block' }}>
            <input type="file" accept="image/*" onChange={handleLogoSelect} style={{ color: 'white' }} />
          </label>

          <div>
            {logoPreview ? (
              <img src={logoPreview} alt="logo preview" style={{ width: '100%', height: 140, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }} />
            ) : existingLogoUrl ? (
              <img src={existingLogoUrl} alt="existing logo" style={{ width: '100%', height: 140, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }} />
            ) : (
              <div style={{ width: '100%', height: 140, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.04)' }}>
                No logo
              </div>
            )}
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <button type="submit" className="btn btn-red" disabled={loading} style={{ padding: '8px 12px', borderRadius: 8 }}>
          {loading ? 'Saving…' : edit ? 'Update Sponsor' : 'Create Sponsor'}
        </button>
        <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ padding: '8px 12px', borderRadius: 8, color: 'white', border: '1px solid rgba(255,255,255,0.06)' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
