// admin/src/pages/CoordinatorForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function CoordinatorForm() {
  const { coordinatorId } = useParams();
  const edit = !!coordinatorId;
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    department: '',
    bio: '',
    contact: '',
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

  // Fetch existing coordinator (edit)
  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const res = await api.get(`/admin/coordinators/${coordinatorId}`);
        const d = res.data?.data || res.data || {};

        setForm({
          name: d.name || '',
          department: d.department || '',
          bio: d.bio || '',
          contact: d.contact || '',
        });

        // prefer photo, then imageUrl, then image
        const rawPhoto = d.photo || d.imageUrl || d.image || null;
        if (rawPhoto) {
          setExistingPhotoUrl(qualifyUrl(rawPhoto));
        } else {
          setExistingPhotoUrl(null);
        }
      } catch (err) {
        console.error('Load coordinator failed', err);
      }
    })();
  }, [coordinatorId, edit]);

  // Generate preview when selecting photo
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photo);
  }, [photo]);

  // Single clean handler (fixed duplicate)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Name is required");

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (photo) fd.append("photo", photo);

      if (edit) {
        await api.put(`/admin/coordinators/${coordinatorId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/admin/coordinators`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      nav("/admin/coordinators");
    } catch (err) {
      console.error(err);
      alert("Save failed — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="card"
      style={{ maxWidth: 800, width: "100%" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          {edit ? "Edit" : "Add"} Coordinator
        </h2>

        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-red"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => nav(-1)}
            className="btn btn-outline text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="p-2 rounded bg-transparent text-white border border-white/10"
        />

        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="p-2 rounded bg-transparent text-white border border-white/10"
        />

        <input
          placeholder="Contact (optional)"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="p-2 rounded bg-transparent text-white border border-white/10"
        />
      </div>

      {/* Bio */}
      <textarea
        placeholder="Bio"
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        className="w-full p-2 rounded bg-transparent text-white border border-white/10 mt-4"
        rows={4}
      />

      {/* Photo upload + preview */}
      <div className="mt-4">
        <label className="text-white/70 text-sm">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="mt-1 text-white"
        />

        <div className="mt-3">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded border border-white/10"
            />
          ) : existingPhotoUrl ? (
            <img
              src={existingPhotoUrl}
              alt="Existing"
              className="w-40 h-40 object-cover rounded border border-white/10"
            />
          ) : (
            <div className="w-40 h-40 rounded border border-white/10 bg-white/5 flex items-center justify-center text-white/50">
              No Photo
            </div>
          )}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-red"
        >
          {loading ? "Saving…" : edit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => nav(-1)}
          className="btn btn-outline text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
