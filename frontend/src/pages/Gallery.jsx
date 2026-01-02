import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Play, Image as ImageIcon, 
  ChevronLeft, ChevronRight, Filter 
} from "lucide-react";
import { api } from "../api";
import { buildImg } from "../utils";

// --- 1. UTILITY FUNCTIONS ---

function extractYouTubeId(url) {
  if (!url) return null;
  const re = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = String(url).match(re);
  return m ? m[1] : null;
}

function getThumbnail(m) {
  const candidate = m.publicUrl || m.url || m.file || m.image || '';
  const isVideo = m.type === 'video' || m.type === 'youtube' || candidate.includes('youtube') || candidate.includes('youtu.be');
  
  if (isVideo) {
    const id = extractYouTubeId(candidate);
    if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return buildImg(candidate) || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800';
}

// --- 2. DUMMY DATA ---
const DUMMY_GALLERY = [
  {
    id: "vid-1",
    type: "video",
    url: "https://www.youtube.com/watch?v=c0KYU2j0TM4",
    caption: "The power of introverts",
    eventName: "TED 2012"
  },
  {
    id: "img-1",
    type: "photo",
    url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    caption: "Capturing the emotion of the moment",
    eventName: "Audience Interaction"
  },
  {
    id: "vid-2",
    type: "video",
    url: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
    caption: "The power of vulnerability",
    eventName: "TEDxHouston"
  },
  {
    id: "img-2",
    type: "photo",
    url: "https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&q=80&w=800",
    caption: "Networking and sharing ideas",
    eventName: "Post-Event"
  },
  {
    id: "img-3",
    type: "photo",
    url: "https://images.unsplash.com/photo-1475721027767-4d563514396e?auto=format&fit=crop&q=80&w=800",
    caption: "Speaker preparation backstage",
    eventName: "Behind the Scenes"
  },
  {
    id: "vid-3",
    type: "video",
    url: "https://www.youtube.com/watch?v=RRZvzXvH25I",
    caption: "The thrilling potential of SixthSense",
    eventName: "TEDIndia 2009"
  }
];

export default function GalleryPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    let mounted = true;
    const fetchMedia = async () => {
      try {
        const res = await api.get('/admin/media/public');
        const data = res?.data?.success ? res.data.data : res?.data || [];
        
        if (!mounted) return;

        const apiItems = (Array.isArray(data) ? data : []).map((m) => {
          const rawUrl = m.publicUrl || m.url || m.file || m.image || '';
          const isVideo = m.type === 'video' || m.type === 'youtube' || rawUrl.includes('youtube') || rawUrl.includes('youtu.be');
          
          return {
            id: m._id || m.id,
            type: isVideo ? 'video' : 'photo',
            url: buildImg(rawUrl) || rawUrl,
            thumbnail: getThumbnail(m),
            caption: m.title || m.description || '',
            eventName: m.eventName || m.meta?.eventName || 'General'
          };
        });

        setMedia(apiItems.length > 0 ? apiItems : DUMMY_GALLERY);
      } catch (err) {
        if (mounted) setMedia(DUMMY_GALLERY);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMedia();
    return () => { mounted = false; };
  }, []);

  // --- FILTERING ---
  const filteredItems = useMemo(() => {
    if (filter === 'all') return media;
    return media.filter(m => m.type === filter);
  }, [media, filter]);

  // --- NAVIGATION ---
  const handleNext = (e) => {
    e?.stopPropagation();
    const idx = filteredItems.findIndex(m => m.id === selectedMedia.id);
    if (idx !== -1 && idx < filteredItems.length - 1) setSelectedMedia(filteredItems[idx + 1]);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    const idx = filteredItems.findIndex(m => m.id === selectedMedia.id);
    if (idx > 0) setSelectedMedia(filteredItems[idx - 1]);
  };

  // Keyboard Support
  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedMedia) return;
      if (e.key === 'Escape') setSelectedMedia(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedMedia]);

  return (
    <div className="bg-black text-white">
      <main className="pt-24 px-4 max-w-6xl mx-auto min-h-screen pb-20">
        
        {/* --- 1. HEADER SECTION --- */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            The Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Chronicle</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-8"
          >
            A curated collection of talks, moments, and memories from our stage.
          </motion.p>

          {/* Filter Tabs - Horizontal Scroll on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { id: 'photo', label: 'Photos', icon: ImageIcon },
              { id: 'video', label: 'Talks', icon: Play },
              { id: 'all', label: 'All Media', icon: Filter },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  filter === f.id 
                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* --- 2. MASONRY GRID --- */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-neutral-900/30">
            <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500">No media found.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid"
              >
                <div 
                  onClick={() => setSelectedMedia(item)}
                  className="group relative rounded-xl overflow-hidden bg-neutral-900 cursor-pointer border border-white/10 hover:border-red-600/50 shadow-lg transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <img 
                    src={item.thumbnail} 
                    alt={item.caption} 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800"; }}
                  />
                  
                  {/* Play Icon for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={20} fill="currentColor" className="text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                      {item.eventName}
                    </span>
                    <p className="text-white text-sm font-bold line-clamp-2">
                      {item.caption || (item.type === 'video' ? "Watch Talk" : "View Photo")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>

      {/* --- 3. LIGHTBOX OVERLAY (Portal) --- */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            {/* Top Close */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-end z-50">
               <button 
                className="p-2 bg-white/10 hover:bg-red-600 rounded-full text-white transition-colors"
                onClick={() => setSelectedMedia(null)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Arrows */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>

            {/* Viewer Content */}
            <div 
              className="relative w-full max-w-5xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
               {selectedMedia.type === 'video' ? (
                 <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(selectedMedia.url)}?autoplay=1&rel=0`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="Video Player"
                    />
                 </div>
               ) : (
                 <motion.img 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={selectedMedia.url} 
                    alt={selectedMedia.caption}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                 />
               )}

               <div className="mt-6 text-center max-w-2xl px-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedMedia.caption}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {selectedMedia.eventName}
                    </span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}