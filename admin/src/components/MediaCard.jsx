// components/MediaCard.jsx
import React from 'react';

export default function MediaCard({ item, onOpen, onEdit, onDelete, mapState, onMapToggle }) {
  // item: { _id, type, title, description, url }
  const thumbFor = (m) => {
    if (!m) return null;
    if (m.type === 'image') {
      // url may be full or relative like uploads/...
      return m.url || m.path || m.filePath || null;
    }
    // video - try youtube thumbnail
    const match = (m.url||'').match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    return null;
  };

  const thumb = thumbFor(item);

  return (
    <div className="ml-card">
      <div className="ml-thumb-wrap">
        {thumb ? <img src={thumb} className="ml-thumb" alt={item.title || 'media'} /> : <div className="ml-thumb-placeholder" />}
      </div>

      <div className="ml-meta">
        <div className="ml-title">{item.title || (item.type === 'video' ? 'YouTube video' : 'Image')}</div>
        <div className="ml-sub">{item.type.toUpperCase()} • {String(item._id).slice(0,8)}</div>
      </div>

      <div className="ml-actions">
        {item.type === 'video' && <a className="ml-btn-outline" href={item.url} target="_blank" rel="noreferrer">Open</a>}
        <button className="ml-btn" onClick={() => onMapToggle(item)}>{mapState ? 'Unmap' : 'Map'}</button>
        <button className="ml-btn-ghost" onClick={() => onEdit(item)}>Edit</button>
        <button className="ml-btn-danger" onClick={() => onDelete(item)}>Delete</button>
      </div>
    </div>
  );
}
