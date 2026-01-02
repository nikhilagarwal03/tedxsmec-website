// admin/src/pages/SpeakerForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function SpeakerForm() {
  const { speakerId } = useParams();
  const edit = !!speakerId;
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    designation: '',
    topic: '',
    bio: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: ''
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // helper to convert backend relative path (uploads/...) to full URL
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
        const res = await api.get(`/admin/speakers/${speakerId}`);
        const d = res.data?.data || res.data || {};

        // prefer socialLinks object but fallback to top-level keys
        const sl = d.socialLinks || d.social || {};
        setForm({
          name: d.name || '',
          designation: d.designation || d.title || '',
          topic: d.topic || '',
          bio: d.bio || '',
          linkedin: sl.linkedin || d.linkedin || '',
          twitter: sl.twitter || d.twitter || '',
          instagram: sl.instagram || d.instagram || '',
          website: sl.website || d.website || ''
        });

        // prefer d.photo then d.imageUrl, then other fallbacks
        const rawPhoto = d.photo || d.imageUrl || d.image || null;
        if (rawPhoto) {
          setExistingPhotoUrl(qualifyUrl(rawPhoto));
        } else {
          setExistingPhotoUrl(null);
        }
      } catch (err) {
        console.error('Load speaker failed', err);
      }
    })();
  }, [speakerId, edit]);

  // preview selected photo (local file)
  useEffect(() => {
    if (!photo) { setPhotoPreview(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photo);
  }, [photo]);

  const handlePhotoSelect = (e) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Please enter the speaker name.');

    setLoading(true);
    try {
      const fd = new FormData();
      // append all fields from form
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (photo) fd.append('photo', photo);

      if (edit) {
        await api.put(`/admin/speakers/${speakerId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/speakers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      nav('/admin/speakers');
    } catch (err) {
      console.error(err);
      alert('Save failed — check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // inline fallback styles (matches TEDx theme)
  const card = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(178,13,18,0.12)', borderRadius: 12, padding: 16, color: 'white' };
  const inputStyle = { padding: 10, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'white' };
  const labelStyle = { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 };

  return (
    <form onSubmit={submit} className="card" style={{ ...card, maxWidth: 980, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}> {edit ? 'Edit' : 'Add'} Speaker</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-red" disabled={loading} style={{ padding: '8px 12px', borderRadius: 8 }}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ padding: '8px 12px', borderRadius: 8, color: 'white', border: '1px solid rgba(255,255,255,0.06)' }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12 }}>
        {/* left: inputs */}
        <div>
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={labelStyle}>Name <span style={{ color: '#ff6b6b' }}>*</span></label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Full name" style={inputStyle} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Designation</label>
                <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} placeholder="Designation" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Topic</label>
                <input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} placeholder="Topic" style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Links</label>
            <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <input value={form.linkedin} onChange={e=>setForm({...form, linkedin:e.target.value})} placeholder="LinkedIn" style={inputStyle} />
              <input value={form.twitter} onChange={e=>setForm({...form, twitter:e.target.value})} placeholder="Twitter / X" style={inputStyle} />
              <input value={form.instagram} onChange={e=>setForm({...form, instagram:e.target.value})} placeholder="Instagram" style={inputStyle} />
            </div>

            <label style={{ ...labelStyle, marginTop: 6 }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={5} placeholder="Short bio" style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} />
          </div>
        </div>

        {/* right: photo */}
        <aside style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Photo</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>120×120 recommended</div>
          </div>

          <label style={{ display:'block' }}>
            <input type="file" accept="image/*" onChange={handlePhotoSelect} style={{ color: 'white' }} />
          </label>

          <div>
            {photoPreview ? (
              <img src={photoPreview} alt="preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
            ) : existingPhotoUrl ? (
              <img src={existingPhotoUrl} alt="existing" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }} />
            ) : (
              <div style={{ width: '100%', height: 220, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.04)' }}>
                No photo
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* footer actions */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12 }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>All text is white; accents are TEDx red.</div>

        <div style={{ display:'flex', gap: 8 }}>
          <button type="submit" className="btn btn-red" disabled={loading} style={{ padding:'8px 12px', borderRadius:8 }}>
            {loading ? 'Saving…' : edit ? 'Update speaker' : 'Create speaker'}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline" style={{ padding:'8px 12px', borderRadius:8, color:'white', border:'1px solid rgba(255,255,255,0.06)' }}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
