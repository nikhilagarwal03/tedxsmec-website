// frontend/src/components/MediaSection.jsx
import React, { useEffect, useState } from 'react';
import { X, Play, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';
import { buildImg } from '../utils';

function extractYouTubeId(url) {
  if (!url) return null;
  const re = /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = String(url).match(re);
  return m ? m[1] : null;
}

function toYouTubeEmbed(url) {
  const id = extractYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}`;
}

function ensureAbsoluteUrl(url) {
  if (!url) return '';
  const s = String(url).trim();
  if (/^https?:\/\//i.test(s)) return s;
  // If starts with // treat as protocol-relative
  if (/^\/\//.test(s)) return window.location.protocol + s;
  // If starts with single slash, absolute path on same origin
  if (s.startsWith('/')) return window.location.origin + s;
  // otherwise assume relative path from server root
  return window.location.origin + '/' + s.replace(/^\/+/, '');
}

function getThumbnail(m) {
  // prefer explicit thumbnail, then youtube thumb, then image publicUrl
  const candidate = m.publicUrl || m.url || m.file || m.image || '';
  if ((m.type === 'video') || (m.type === 'youtube') || m.video) {
    const id = extractYouTubeId(candidate);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    if (m.thumbnail) return ensureAbsoluteUrl(m.thumbnail);
    return '/placeholder-media.png';
  }
  // image
  const img = buildImg(candidate) || candidate;
  return ensureAbsoluteUrl(img) || '/placeholder-media.png';
}

function normalizeType(m) {
  if (!m || !m.type) return 'photo';
  if (m.type === 'image') return 'photo';
  if (m.type === 'photo') return 'photo';
  if (m.type === 'video') return 'video';
  return m.type;
}

function deriveEventName(m) {
  return (
    m.eventName ||
    m.eventTitle ||
    (m.event && (m.event.name || m.event.title)) ||
    (m.meta && m.meta.eventName) ||
    'General'
  );
}

export default function MediaSection() {
  const [media, setMedia] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'photo' | 'video'

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/admin/media/public');
        const data = res?.data?.success ? res.data.data : res?.data || [];
        if (!mounted) return;
        const items = (Array.isArray(data) ? data : []).map((m) => {
          const rawUrl = m.publicUrl || m.url || m.file || m.image || '';
          const absUrl = ensureAbsoluteUrl(buildImg(rawUrl) || rawUrl);
          return {
            id: m._id || m.id,
            raw: m,
            type: normalizeType(m),
            url: absUrl,
            thumbnail: ensureAbsoluteUrl(getThumbnail(m)),
            caption: m.title || m.description || '',
            eventName: deriveEventName(m)
          };
        });
        setMedia(items);
      } catch (err) {
        console.error('Failed to fetch media', err);
        if (!mounted) return;
        setMedia([]); // show empty state
      }
    })();
    return () => { mounted = false; };
  }, []);

  const mediaList = media || [];
  const filteredMedia = filter === 'all' ? mediaList : mediaList.filter((it) => it.type === filter);
  const groupedMedia = filteredMedia.reduce((acc, item) => {
    const key = item.eventName || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="py-20 bg-black" id="media">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Media <span className="text-red-600">Gallery</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Relive the moments that made our events unforgettable
          </p>

          <div className="flex justify-center gap-4">
            {(['all', 'photo', 'video']).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  filter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {media === null && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-900/40 rounded animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {media !== null && mediaList.length === 0 && (
          <div className="text-center text-gray-400">No media yet</div>
        )}

        {/* Groups */}
        {media !== null && Object.entries(groupedMedia).map(([eventName, items]) => (
          <div key={eventName} className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              {eventName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id || item.url}
                  onClick={() => setSelectedMedia(item)}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer border border-red-600/20 hover:border-red-600/50 transition-all duration-300"
                >
                  <img
                    src={item.type === 'video' ? item.thumbnail : (item.url || item.thumbnail)}
                    alt={item.caption}
                    onError={(e) => { e.currentTarget.src = '/placeholder-media.png'; }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3 transform transition-all duration-300 group-hover:scale-110">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                  )}

                  {item.type === 'photo' && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
                        <ImageIcon size={16} className="text-white" />
                      </div>
                    </div>
                  )}

                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm text-white font-medium truncate">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Modal / lightbox */}
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors duration-300"
            >
              <X size={24} className="text-white" />
            </button>

            <div
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'photo' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.caption}
                  onError={(e) => { e.currentTarget.src = '/placeholder-media.png'; }}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
              ) : (
                <div className="aspect-video w-full">
                  <iframe
                    src={toYouTubeEmbed(selectedMedia.url)}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={selectedMedia.caption || 'Video'}
                  />
                </div>
              )}

              {selectedMedia.caption && (
                <div className="mt-4 text-center">
                  <p className="text-white text-lg">{selectedMedia.caption}</p>
                  <p className="text-gray-400 text-sm mt-2">{selectedMedia.eventName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

