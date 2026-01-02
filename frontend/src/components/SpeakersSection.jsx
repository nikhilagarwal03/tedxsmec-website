// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { api } from "../api";
// import { buildImg } from "../utils";
// import { Instagram, Linkedin, Twitter, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// // Fallback Data
// const DUMMY_SPEAKER = [
//   {
//     id: "dummy-virat",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   },
//   {
//     id: "dummy-virat-2",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   },
//   {
//     id: "dummy-virat-3",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   },
//   {
//     id: "dummy-virat-4",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   },
//   {
//     id: "dummy-virat-5",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   },
//   {
//     id: "dummy-virat-6",
//     name: "Virat Kohli",
//     designation: "Indian Cricketer & Leader",
//     photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", // Wiki commons public image
//     socialLinks: {
//       instagram: "https://instagram.com/virat.kohli",
//       twitter: "https://twitter.com/imVkohli",
//       linkedin: "https://www.linkedin.com/in/virat-kohli-123456789/"
//     }
//   }
// ];

// const SpeakerSkeleton = () => (
//   <div className="min-w-full sm:min-w-[50%] lg:min-w-[calc(25%-18px)] snap-center">
//     <div className="relative h-[450px] rounded-xl bg-neutral-900 border border-white/5 overflow-hidden animate-pulse">
//       <div className="w-full h-full bg-neutral-800/50" />
//       <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-black/80 to-transparent">
//         <div className="w-12 h-1 bg-neutral-700 rounded" />
//         <div className="h-8 w-3/4 bg-neutral-700 rounded" />
//         <div className="h-4 w-1/2 bg-neutral-700 rounded" />
//       </div>
//     </div>
//   </div>
// );

// export default function SpeakersSection() {
//   const [speakers, setSpeakers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchSpeakers = async () => {
//       try {
//         const endpoints = ["/admin/speakers/public/list", "/speakers"];
//         let data = [];
//         let success = false;

//         for (const ep of endpoints) {
//           try {
//             const res = await api.get(ep);
//             if (res.data?.success) {
//               data = res.data.data;
//               success = true;
//               break;
//             } else if (Array.isArray(res.data)) {
//               data = res.data;
//               success = true;
//               break;
//             }
//           } catch (e) {
//             continue;
//           }
//         }

//         if (isMounted) {
//           const list = Array.isArray(data) ? data : (data?.list || []);
//           if (list.length > 0) {
//             setSpeakers(list);
//           } else {
//             // API worked but returned empty -> Show Dummy
//             setSpeakers(DUMMY_SPEAKER);
//           }
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Failed to load speakers", err);
//         if (isMounted) {
//           // API Failed completely -> Show Dummy
//           setSpeakers(DUMMY_SPEAKER);
//           setLoading(false);
//         }
//       }
//     };

//     fetchSpeakers();
//     return () => { isMounted = false; };
//   }, []);

//   const getSocial = (speaker, key) => {
//     if (!speaker) return undefined;
//     const sl = speaker.socialLinks || {};
//     return sl[key] || speaker[key] || speaker[`${key}Url`] || null;
//   };

//   // Scroll Handlers
//   const scroll = (direction) => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const scrollAmount = direction === "left" ? -el.offsetWidth : el.offsetWidth;
//     el.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   };

//   // Card renderer (shared between carousel and grid)
//   const renderCard = (speaker, idx, clickable = true) => {
//     const img = speaker.id === 'dummy-virat' ? speaker.photo : buildImg(speaker.photo || speaker.imageUrl || speaker.image);
//     const id = speaker._id || speaker.id || speaker.slug || idx;
//     const linkedin = getSocial(speaker, "linkedin");
//     const instagram = getSocial(speaker, "instagram");
//     const twitter = getSocial(speaker, "twitter");

//     const handleActivate = (e) => {
//       if (!clickable) return;
//       if (id !== 'dummy-virat') window.location.href = `/speakers/${id}`;
//     };

//     const onKeyDown = (e) => {
//       if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault();
//         handleActivate(e);
//       }
//     };

//     return (
//       <div 
//         key={id || idx}
//         className="min-w-[90%] sm:min-w-[48%] lg:min-w-[23%] snap-center flex-shrink-0"
//       >
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.98 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.45 }}
//           viewport={{ once: true }}
//           role={clickable ? 'link' : undefined}
//           tabIndex={clickable ? 0 : -1}
//           onKeyDown={onKeyDown}
//           className="group relative h-[380px] overflow-hidden rounded-xl bg-neutral-900 cursor-pointer border border-white/5 hover:border-red-600/30 transition-all focus:outline-none focus:ring-4 focus:ring-red-700/30"
//           onClick={handleActivate}
//           aria-label={`Open speaker ${speaker.name}`}
//         >
//           {/* Image Layer */}
//           <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
//             <img
//               src={img}
//               alt={speaker.name}
//               loading="lazy"
//               className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
//               onError={(e) => {
//                   e.target.onerror = null; 
//                   e.target.src = "https://via.placeholder.com/400x600?text=TEDx+Speaker";
//               }}
//             />
//           </div>

//           {/* Overlays */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
//           <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

//           {/* Socials */}
//           <div className="absolute top-4 right-4 flex flex-col gap-3 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
//             {[
//               { icon: Linkedin, link: linkedin },
//               { icon: Twitter, link: twitter },
//               { icon: Instagram, link: instagram }
//             ].map((social, i) => social.link && (
//               <a
//                 key={i}
//                 href={social.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 className="p-2.5 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition-colors"
//                 aria-label={`Open ${speaker.name}'s ${social.link.includes('instagram') ? 'Instagram' : social.link.includes('linkedin') ? 'LinkedIn' : 'Twitter'}`}
//               >
//                 <social.icon size={18} />
//               </a>
//             ))}
//           </div>

//           {/* Text */}
//           <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
//             <div className="w-12 h-1 bg-red-600 mb-4 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
//             <h3 className="text-3xl font-black text-white uppercase leading-none mb-2 drop-shadow-lg">
//               {speaker.name?.split(" ")[0]}
//               <span className="block text-red-600/80 group-hover:text-white transition-colors">
//                 {speaker.name?.split(" ").slice(1).join(" ")}
//               </span>
//             </h3>
//             <p className="text-sm font-medium text-gray-300 line-clamp-2">
//               {speaker.designation}
//             </p>
//           </div>

//         </motion.div>
//       </div>
//     );
//   };

//   return (
//     <section className="relative py-24 bg-black overflow-hidden">
      
//       {/* Background Ambience */}
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

//       <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
//         {/* Header with Navigation Buttons */}
//         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-8">
//           <div>
//             <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-2 block">
//               The Lineup
//             </span>
//             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
//               Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Speakers</span>
//             </h2>
//           </div>
          
//           <div className="flex items-center gap-4">
//             {/* Scroll Buttons (visible on mobile carousel only) */}
//             <div className="flex md:hidden gap-2">
//               <button 
//                 onClick={() => scroll("left")}
//                 className="p-3 rounded-full border border-white/20 text-white hover:bg-red-600 hover:border-red-600 transition-all active:scale-95"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <button 
//                 onClick={() => scroll("right")}
//                 className="p-3 rounded-full border border-white/20 text-white hover:bg-red-600 hover:border-red-600 transition-all active:scale-95"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>

//             <div className="flex items-center gap-3">
//               <Link
//                 to="/speakers"
//                 className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
//                 aria-label="View all speakers"
//               >
//                 View All Speakers
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Mobile: horizontal carousel (touch/swipe) */}
//         <div className="md:hidden">
//           <div
//             ref={scrollRef}
//             className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             aria-label="Speakers carousel"
//           >
//             {loading ? (
//               <>
//                 <SpeakerSkeleton />
//                 <SpeakerSkeleton />
//                 <SpeakerSkeleton />
//                 <SpeakerSkeleton />
//               </>
//             ) : (
//               speakers.map((speaker, idx) => renderCard(speaker, idx))
//             )}
//           </div>
//         </div>

//         {/* Desktop: responsive grid */}
//         <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
//           {loading ? (
//             <>
//               <SpeakerSkeleton />
//               <SpeakerSkeleton />
//               <SpeakerSkeleton />
//               <SpeakerSkeleton />
//             </>
//           ) : (
//             speakers.map((speaker, idx) => (
//               <div key={speaker._id || speaker.id || idx} className="w-full">
//                 {renderCard(speaker, idx, false)}
//               </div>
//             ))
//           )}
//         </div>
        
//         {/* Mobile Swipe Indicator (Optional) */}
//         <div className="md:hidden flex justify-center mt-4 gap-2">
//             <span className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Swipe to explore</span>
//         </div>

//       </div>
//     </section>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { X, Linkedin, Twitter, Instagram, ChevronLeft, ChevronRight, ArrowRight, Mic2, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { buildImg } from "../utils";

// --- 1. MAGNETIC CARD COMPONENT WITH SOCIAL HOVER ---
const MagneticSpeakerCard = ({ speaker, onCardClick }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const img = speaker.id?.includes('dummy') ? speaker.photo : buildImg(speaker.photo || speaker.imageUrl || speaker.image);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick?.();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${speaker.name}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: 'transform' }}
      className="relative h-[360px] sm:h-[420px] md:h-[460px] min-w-[240px] sm:min-w-[280px] md:min-w-[360px] lg:min-w-[380px] rounded-[1.75rem] sm:rounded-[2.25rem] bg-neutral-900 border border-white/10 hover:border-red-600/40 overflow-hidden group cursor-pointer flex-shrink-0 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Background Image Layer */}
      <div style={{ transform: "translateZ(20px)" }} className="absolute inset-0">
        <img
          src={img}
          alt={speaker.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        {/* Subtle shine on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-1/3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* SOCIAL HANDLES (Visible on Hover) */}
      <div className="absolute top-6 right-6 z-30 hidden md:flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        {[
          { Icon: Linkedin, link: speaker.linkedin || speaker.socialLinks?.linkedin },
          { Icon: Twitter, link: speaker.twitter || speaker.socialLinks?.twitter },
          { Icon: Instagram, link: speaker.instagram || speaker.socialLinks?.instagram }
        ].map((social, i) => social.link && (
          <a
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${speaker.name}'s ${social.Icon.displayName || 'social'} profile`}
            className="p-3 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <social.Icon size={18} />
          </a>
        ))}
      </div>

      {/* Info Layer */}
      <div style={{ transform: "translateZ(80px)" }} className="absolute bottom-0 p-8 w-full">
        <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
          {speaker.designation}
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tight">
          {speaker.name}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-white/50 group-hover:text-red-500 transition-colors text-[10px] uppercase font-semibold tracking-wide">
          Learn More <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </div>

        {/* Mobile social links inline */}
        <div className="mt-3 flex md:hidden gap-3">
          {[
            { Icon: Linkedin, link: speaker.linkedin || speaker.socialLinks?.linkedin, label: 'LinkedIn' },
            { Icon: Twitter, link: speaker.twitter || speaker.socialLinks?.twitter, label: 'Twitter' },
            { Icon: Instagram, link: speaker.instagram || speaker.socialLinks?.instagram, label: 'Instagram' }
          ].map((s, i) => s.link && (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${speaker.name}'s ${s.label} profile`}
              className="p-2.5 bg-white/5 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <s.Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- 2. SIDE-DRAWER COMPONENT (Styled like SpeakerProfile.jsx) ---
const SpeakerDrawer = ({ speaker, onClose }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-neutral-950 z-[110] border-l border-white/10 shadow-2xl flex flex-col"
    >
      {/* Scrollable Container with defined height for inner scroll */}
      <div
        className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-12 scrollbar-hide custom-scrollbar"
        style={{ overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}
        onWheelCapture={(e) => { e.stopPropagation(); }}
        onTouchMove={(e) => { e.stopPropagation(); }}
      >
        <button
          onClick={onClose}
          className="sticky top-0 float-right z-50 p-2 sm:p-3 rounded-full bg-white/5 hover:bg-red-600 text-white transition-all shadow-xl"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8 md:space-y-10">
          <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
            <img
              src={speaker.id?.includes('dummy') ? speaker.photo : buildImg(speaker.photo || speaker.imageUrl)}
              alt={speaker.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <Mic2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs">Featured Speaker</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{speaker.name}</h2>
            <p className="text-lg sm:text-xl text-gray-400 font-medium">{speaker.designation}</p>
          </div>

          {/* Bio & Topic using SpeakerProfile logic */}
          {(speaker.bio || speaker.description) && (
            <div className="p-4 sm:p-6 bg-white/5 border-l-4 border-red-600 rounded-r-2xl">
              <Quote className="text-red-600/40 mb-2" size={28} />
              <h4 className="text-white font-bold text-base sm:text-lg mb-2 italic">"{speaker.talkTopic || 'Echoes of Innovation'}"</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{speaker.bio || speaker.description}</p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-white/5">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs">Connect</h4>
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: Linkedin, link: speaker.linkedin || speaker.socialLinks?.linkedin },
                { icon: Twitter, link: speaker.twitter || speaker.socialLinks?.twitter },
                { icon: Instagram, link: speaker.instagram || speaker.socialLinks?.instagram }
              ].map((s, i) => s.link && (
                <a key={i} href={s.link} target="_blank" rel="noreferrer" className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl hover:bg-red-600 text-white transition-all">
                  <s.icon size={18} className="sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN COMPONENT ---
export default function SpeakersSection() {
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const scrollRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const body = document.body;
    const compensate = window.innerWidth - document.documentElement.clientWidth;
    if (selectedSpeaker) {
      body.style.overflow = 'hidden';
      if (compensate > 0) body.style.paddingRight = `${compensate}px`;
    } else {
      body.style.overflow = '';
      body.style.paddingRight = '';
    }
    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [selectedSpeaker]);

  // Full Dummy Data Set
  const DUMMY_DATA = [
    { id: "dummy-1", name: "Virat Kohli", designation: "Athlete & Leader", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg", linkedin: "#", instagram: "#", bio: "Legendary athlete exploring the grit required for high-performance innovation." },
    { id: "dummy-2", name: "Anjali Sharma", designation: "Tech Visionary", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600", twitter: "#", bio: "Leading AI research that bridges the gap between technology and human empathy." },
    { id: "dummy-3", name: "Vikram Singh", designation: "Eco Innovator", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600", linkedin: "#", bio: "Redesigning urban ecosystems to reverberate with sustainability." },
    { id: "dummy-4", name: "Sneha Reddy", designation: "Curator", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600", instagram: "#", bio: "Finding the hidden stories that spark global conversations." }
  ];

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await api.get("/admin/speakers/public/list");
        if (res.data?.success && res.data.data.length > 0) setSpeakers(res.data.data);
        else setSpeakers(DUMMY_DATA);
      } catch { setSpeakers(DUMMY_DATA); }
    };
    fetchSpeakers();
  }, []);

  // Auto-hide the mobile swipe hint after a delay
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 10000);
    return () => clearTimeout(t);
  }, [showHint]);

  // Arrow keys navigate carousel when drawer is closed and section is in view
  useEffect(() => {
    const inView = () => {
      const el = scrollRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const onKey = (e) => {
      if (selectedSpeaker) return; // don't scroll background when drawer open
      if (!inView()) return;
      if (e.key === 'ArrowLeft') scroll('left');
      if (e.key === 'ArrowRight') scroll('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedSpeaker]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -450 : 450;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-black relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-12 text-center md:text-left">
          <div className="max-w-xl">
            <span className="eyebrow block mb-3 md:mb-4">The Lineup</span>
            <h2 className="heading-section leading-[0.9]">
              Meet the <span className="text-red-600 drop-shadow-[0_0_20px_rgba(230,43,30,0.3)]">Voices.</span>
            </h2>
          </div>

          <Link to="/speakers" className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 bg-red-600 text-white font-black rounded-full uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-white hover:text-red-600 transition-all shadow-lg shadow-red-900/20 w-full sm:w-auto">
            View All Speakers <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Mobile edge gradients to suggest horizontal scroll */}
          <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent z-20" />
          <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent z-20" />
          {/* Overlaid Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-r-2xl opacity-0 group-hover/carousel:opacity-100 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hidden md:block"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-l-2xl opacity-0 group-hover/carousel:opacity-100 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hidden md:block"
          >
            <ChevronRight size={32} />
          </button>

          {/* Scrollable Row */}
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-8 md:pb-12 scroll-smooth no-scrollbar select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onTouchStart={() => setShowHint(false)}
              onScroll={() => setShowHint(false)}
              onMouseDown={() => setShowHint(false)}
            >
              {speakers.map((s, i) => (
                <MagneticSpeakerCard
                  key={s.id || i}
                  speaker={s}
                  onCardClick={() => setSelectedSpeaker(s)}
                />
              ))}
            </div>
          {/* Mobile swipe hint */}
          {showHint && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/80">
              <ChevronLeft size={16} />
              <span className="text-[10px] uppercase tracking-widest">Swipe to explore</span>
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedSpeaker && (
          <>
            {/* Backdrop: Allows background scroll as per your request, closes drawer on click */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onWheelCapture={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); }}
            />
            <SpeakerDrawer speaker={selectedSpeaker} onClose={() => setSelectedSpeaker(null)} />
          </>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E62B1E; }
      `}</style>
    </section>
  );
}