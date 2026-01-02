// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MapPin,
//   ArrowRight,
//   Mic2,
//   Users,
//   ChevronDown,
//   Calendar
// } from "lucide-react";
// import { api } from "../api";
// import { buildImg } from "../utils";

// // ─── FALLBACK DATA ─────────────────────────────────────────────
// const DUMMY_EVENTS = [
//   {
//     _id: "evt-1",
//     slug: "echoes-of-innovation",
//     name: "Echoes of Innovation",
//     date: new Date(Date.now() + 864000000).toISOString(),
//     venue: "Grand Auditorium",
//     description:
//       "Exploring how past reverberations shape our future technologies.",
//     image:
//       "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1200"
//   },
//   {
//     _id: "evt-2",
//     slug: "sustainable-horizons",
//     name: "Sustainable Horizons",
//     date: new Date(Date.now() + 1728000000).toISOString(),
//     venue: "Green Park Center",
//     description:
//       "A deep dive into eco-friendly architecture and living.",
//     image:
//       "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1200"
//   }
// ];

// // ─── IMAGE RESOLVER ───────────────────────────────────────────
// const resolveImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") {
//     if (img.startsWith("http")) return img;
//     return buildImg(img);
//   }
//   if (typeof img === "object") {
//     if (img.url) return img.url;
//     if (img.secure_url) return img.secure_url;
//     if (img.path) return buildImg(img.path);
//   }
//   if (Array.isArray(img) && img.length > 0) {
//     return resolveImage(img[0]);
//   }
//   return null;
// };

// // ─── VENUE RESOLVER (FIX) ─────────────────────────────────────
// const resolveVenue = (e) =>
//   e?.venue ||
//   e?.venueName ||
//   e?.location ||
//   e?.place ||
//   e?.address ||
//   e?.venue?.name ||
//   "TBA";

// export default function EventsSection() {
//   const [events, setEvents] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const navigate = useNavigate();

//   // ─── FETCH EVENTS ───────────────────────────────────────────
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await api.get("/events");
//         const data = res?.data?.success ? res.data.data : res.data;
//         setEvents(Array.isArray(data) && data.length ? data : DUMMY_EVENTS);
//       } catch (err) {
//         console.warn("Events API failed, using fallback", err);
//         setEvents(DUMMY_EVENTS);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // ─── UPCOMING EVENTS ────────────────────────────────────────
//   const upcomingEvents = events
//     .filter((e) => new Date(e.date) > new Date())
//     .sort((a, b) => new Date(a.date) - new Date(b.date));

//   const visibleEvents = isExpanded
//     ? upcomingEvents
//     : upcomingEvents.slice(0, 2);

//   const hasHiddenEvents = upcomingEvents.length > 2;

//   const StatItem = ({ icon: Icon, label, value }) => (
//     <div className="flex flex-col items-center p-4 border border-white/10 rounded-lg bg-neutral-900/50 backdrop-blur">
//       <Icon className="text-red-600 mb-2" size={22} />
//       <span className="text-2xl font-bold text-white">{value}</span>
//       <span className="text-xs uppercase tracking-widest text-gray-400">
//         {label}
//       </span>
//     </div>
//   );

//   return (
//     <section className="relative bg-black py-24 overflow-hidden min-h-[80vh]">
//       {/* Ambient Glow */}
//       <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/10 blur-[100px] rounded-full" />

//       <div className="max-w-7xl mx-auto px-6 relative z-10">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
//           <div>
//             <span className="text-red-600 font-bold tracking-widest uppercase text-sm block mb-2">
//               Mark Your Calendars
//             </span>
//             <h2 className="text-4xl md:text-5xl font-black text-white">
//               Upcoming <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
//                 Experiences
//               </span>
//             </h2>
//           </div>
//           <div className="flex gap-4">
//             <StatItem icon={Mic2} label="Speakers" value="20+" />
//             <StatItem icon={Users} label="Attendees" value="500+" />
//           </div>
//         </div>

//         {/* EVENTS GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <AnimatePresence>
//             {visibleEvents.map((event, idx) => {
//               const banner = resolveImage(
//                 event.banner || event.image || event.bannerUrl
//               );

//               const date = new Date(event.date).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric"
//               });

//               const mobileVisibility =
//                 !isExpanded && idx === 1 ? "hidden md:block" : "block";

//               return (
//                 <motion.div
//                   key={event._id || idx}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={() =>
//                     navigate(`/events/${event.slug || event._id}`)
//                   }
//                   className={`group relative h-[400px] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-red-600/50 transition-all ${mobileVisibility}`}
//                 >
//                   {/* IMAGE */}
//                   {banner && (
//                     <img
//                       src={banner}
//                       alt={event.name}
//                       onError={(e) =>
//                         (e.currentTarget.src =
//                           "https://images.unsplash.com/photo-1544531586-fde5298cdd40")
//                       }
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                       loading="lazy"
//                     />
//                   )}

//                   {/* OVERLAY */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 flex flex-col justify-end">
//                     <div className="flex items-center gap-3 mb-3 text-red-500 text-sm font-bold uppercase tracking-wider">
//                       <span className="bg-red-600 text-white px-2 py-1 rounded-sm flex items-center gap-1">
//                         <Calendar size={12} /> {date}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <MapPin size={14} /> {resolveVenue(event)}
//                       </span>
//                     </div>

//                     <h3 className="text-3xl font-bold text-white mb-2">
//                       {event.name}
//                     </h3>

//                     <p className="text-gray-400 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       {event.description}
//                     </p>

//                     <button className="flex items-center gap-2 text-white font-semibold group-hover:text-red-500 transition-colors">
//                       View Details <ArrowRight size={18} />
//                     </button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         </div>

//         {/* EXPAND / COLLAPSE */}
//         {!isExpanded && hasHiddenEvents && (
//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={() => setIsExpanded(true)}
//               className="flex items-center gap-2 px-8 py-4 bg-red-600/10 backdrop-blur rounded-full border border-red-600/30 text-red-500 font-bold uppercase tracking-widest hover:bg-red-600/20"
//             >
//               View All Events <ChevronDown />
//             </button>
//           </div>
//         )}

//         {isExpanded && (
//           <div className="mt-8 text-center">
//             <button
//               onClick={() => setIsExpanded(false)}
//               className="text-gray-500 hover:text-white text-sm uppercase tracking-widest flex items-center gap-2 mx-auto"
//             >
//               Show Less <ChevronDown className="rotate-180" size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Content pulled from your single-event focus
const MAIN_EVENT = {
  name: "Echoes of Innovation",
  date: "March 20, 2026",
  time: "10:00 AM - 05:00 PM",
  venue: "Grand Auditorium, SMEC",
  description: "A transformative journey through the reverberations of past breakthroughs and their impact on our future. Join us for a day of ideas that don't just speak—they resonate.",
  image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000",
  agenda: [
    { time: "10:00 AM", title: "Opening: The First Echo", desc: "Introductory remarks and performance." },
    { time: "11:30 AM", title: "Session I: Neural Networks", desc: "Exploring the connectivity of modern ideas." },
    { time: "02:00 PM", title: "Session II: Future Silence", desc: "The impact of technology on human connection." },
    { time: "04:30 PM", title: "Closing: The Final Resonance", desc: "Concluding thoughts and networking." }
  ]
};

export default function EventsSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-12 md:py-24 bg-black relative overflow-hidden selection:bg-red-600">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-8 md:mb-16 text-center md:text-left">
          <span className="eyebrow block mb-3 md:mb-4">The Main Event</span>
          <h2 className="heading-section">
            Upcoming <span className="text-red-600">Experience.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-stretch">
          
          {/* LEFT: Event Identity */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-[3rem] bg-neutral-900/40 border border-white/5 relative group"
          >
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 md:mb-8">
                <div className="px-3 sm:px-4 py-2 bg-red-600 rounded-full text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                  <Calendar size={11} /> {MAIN_EVENT.date}
                </div>
                <div className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                  <MapPin size={11} /> {MAIN_EVENT.venue}
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 uppercase italic tracking-tighter leading-none">
                {MAIN_EVENT.name}
              </h3>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 md:mb-10">
                {MAIN_EVENT.description}
              </p>
            </div>

            <Link 
              to="/events" 
              className="group inline-flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-black rounded-full uppercase tracking-widest text-[10px] sm:text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl"
            >
              Full Event Info <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          {/* RIGHT: Agenda Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-[3rem] border border-white/5 bg-gradient-to-br from-neutral-900/20 to-transparent"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-6 md:mb-10">
              <Clock className="text-red-600" size={20} />
              <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm">The Agenda Preview</h4>
            </div>

            <div className="space-y-4 sm:space-y-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-[2px] bg-white/5" />

              {MAIN_EVENT.agenda.map((item, i) => (
                <motion.div 
                  key={i}
                  onClick={() => setActiveStep(i)}
                  onMouseEnter={() => setActiveStep(i)}
                  className={`relative pl-10 sm:pl-12 cursor-pointer sm:cursor-default transition-all duration-500 ${activeStep === i ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                >
                  {/* Point */}
                  <div className={`absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${activeStep === i ? 'bg-red-600 border-red-600 scale-110 shadow-[0_0_20px_rgba(230,43,30,0.5)]' : 'bg-black border-white/20'}`}>
                    <Zap size={12} className={activeStep === i ? 'text-white' : 'text-gray-600'} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-red-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em]">{item.time}</span>
                    <h5 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">{item.title}</h5>
                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="text-gray-500 text-xs sm:text-sm overflow-hidden"
                        >
                          {item.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}