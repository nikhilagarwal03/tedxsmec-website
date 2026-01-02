// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Calendar, MapPin, Filter, ArrowRight } from "lucide-react";
// // import { api } from "../api";
// // import { buildImg } from "../utils";

// // // ─── IMAGE RESOLVER ────────────────────────────────────────────
// // const resolveImage = (img) => {
// //   if (!img) return null;
// //   if (img.startsWith("http")) return img;
// //   return buildImg(img);
// // };

// // // ─── VENUE RESOLVER (FIX) ──────────────────────────────────────
// // const resolveVenue = (event) => {
// //   return (
// //     event?.venue ||
// //     event?.venueName ||
// //     event?.location ||
// //     event?.place ||
// //     event?.address ||
// //     event?.eventVenue ||
// //     event?.venue?.name ||
// //     "Venue TBA"
// //   );
// // };

// // // ─── DUMMY DATA ────────────────────────────────────────────────
// // const DUMMY_EVENTS = [
// //   {
// //     _id: "evt-1",
// //     slug: "echoes-of-innovation",
// //     name: "Echoes of Innovation",
// //     date: new Date(Date.now() + 864000000).toISOString(),
// //     venue: "Grand Auditorium",
// //     description:
// //       "Exploring how past reverberations shape our future technologies.",
// //     image:
// //       "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000",
// //   },
// //   {
// //     _id: "evt-2",
// //     slug: "sustainable-horizons",
// //     name: "Sustainable Horizons",
// //     date: new Date(Date.now() + 1728000000).toISOString(),
// //     venue: "Green Park Center",
// //     description: "A deep dive into eco-friendly architecture and living.",
// //     image:
// //       "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
// //   },
// // ];

// // export default function EventsPage() {
// //   const [events, setEvents] = useState([]);
// //   const [filter, setFilter] = useState("all");
// //   const [search, setSearch] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   // ─── FETCH EVENTS ───────────────────────────────────────────
// //   useEffect(() => {
// //     const fetchEvents = async () => {
// //       try {
// //         const res = await api.get("/events");
// //         const data = res?.data?.success ? res.data.data : res.data;

// //         // 🔹 Normalize events (VENUE FIX HERE)
// //         const normalized = Array.isArray(data)
// //           ? data.map((ev) => ({
// //               ...ev,
// //               venue: resolveVenue(ev),
// //             }))
// //           : [];

// //         setEvents(normalized.length ? normalized : DUMMY_EVENTS);
// //       } catch (err) {
// //         console.error("Events fetch failed:", err);
// //         setEvents(DUMMY_EVENTS);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchEvents();
// //   }, []);

// //   const isUpcoming = (ev) => new Date(ev.date) > new Date();

// //   const displayEvents = events
// //     .filter(
// //       (e) =>
// //         e.name?.toLowerCase().includes(search.toLowerCase()) ||
// //         e.venue?.toLowerCase().includes(search.toLowerCase())
// //     )
// //     .filter((e) => {
// //       if (filter === "upcoming") return isUpcoming(e);
// //       if (filter === "past") return !isUpcoming(e);
// //       return true;
// //     })
// //     .sort((a, b) =>
// //       filter === "upcoming"
// //         ? new Date(a.date) - new Date(b.date)
// //         : new Date(b.date) - new Date(a.date)
// //     );

// //   return (
// //     <div className="min-h-screen bg-black text-white pt-24 pb-20">
// //       <div className="max-w-7xl mx-auto px-6">

// //         {loading ? (
// //           <div className="flex justify-center py-20">
// //             <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
// //           </div>
// //         ) : displayEvents.length === 0 ? (
// //           <div className="text-center py-20">
// //             <Filter size={40} className="mx-auto text-gray-600 mb-4" />
// //             <p className="text-gray-400">No events found</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {displayEvents.map((event) => {
// //               const banner = resolveImage(
// //                 event.banner || event.image || event.bannerUrl
// //               );

// //               return (
// //                 <div
// //                   key={event._id}
// //                   onClick={() =>
// //                     navigate(`/events/${event.slug || event._id}`)
// //                   }
// //                   className="group bg-neutral-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 transition-all"
// //                 >
// //                   {/* IMAGE */}
// //                   <div className="h-56 overflow-hidden relative">
// //                     {banner && (
// //                       <img
// //                         src={banner}
// //                         alt={event.name}
// //                         onError={(e) =>
// //                           (e.currentTarget.src =
// //                             "https://images.unsplash.com/photo-1544531586-fde5298cdd40")
// //                         }
// //                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //                         loading="lazy"
// //                       />
// //                     )}
// //                     <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded text-xs">
// //                       <Calendar size={12} className="inline mr-1 text-red-500" />
// //                       {new Date(event.date).toLocaleDateString()}
// //                     </div>
// //                   </div>

// //                   {/* CONTENT */}
// //                   <div className="p-6">
// //                     <h3 className="text-xl font-bold mb-2 group-hover:text-red-500">
// //                       {event.name}
// //                     </h3>
// //                     <p className="text-gray-400 text-sm mb-4 line-clamp-2">
// //                       {event.description}
// //                     </p>
// //                     <div className="flex justify-between items-center text-sm text-gray-500">
// //                       <span className="flex items-center gap-1">
// //                         <MapPin size={14} /> {event.venue}
// //                       </span>
// //                       <ArrowRight size={16} />
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Search, Filter, ArrowRight } from 'lucide-react';
// import { api } from '../api';
// import { buildImg } from '../utils';

// // --- DUMMY DATA ---
// const DUMMY_EVENTS = [
//   {
//     _id: "evt-1",
//     slug: "echoes-of-innovation",
//     name: "Echoes of Innovation",
//     date: new Date(Date.now() + 864000000).toISOString(), // Upcoming
//     venue: "Grand Auditorium",
//     description: "Exploring how past reverberations shape our future technologies.",
//     image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000",
//   },
//   {
//     _id: "evt-2",
//     slug: "sustainable-horizons",
//     name: "Sustainable Horizons",
//     date: new Date(Date.now() + 1728000000).toISOString(), // Upcoming
//     venue: "Green Park Center",
//     description: "A deep dive into eco-friendly architecture and living.",
//     image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
//   },
//   {
//     _id: "evt-3",
//     slug: "digital-frontiers",
//     name: "Digital Frontiers",
//     date: new Date(Date.now() - 864000000).toISOString(), // Past
//     venue: "Tech Hub",
//     description: "Navigating the complexities of the metaverse and AI.",
//     image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
//   },
//   {
//     _id: "evt-4",
//     slug: "art-in-motion",
//     name: "Art in Motion",
//     date: new Date(Date.now() - 1728000000).toISOString(), // Past
//     venue: "City Gallery",
//     description: "The intersection of kinetic energy and classical sculpture.",
//     image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000",
//   }
// ];

// export default function EventsPage() {
//   const [events, setEvents] = useState([]);
//   const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // 1. Fetch Logic
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await api.get('/events');
//         const data = res.data?.success ? res.data.data : res.data;
//         if (Array.isArray(data) && data.length > 0) {
//           setEvents(data);
//         } else {
//           setEvents(DUMMY_EVENTS);
//         }
//       } catch (err) {
//         console.warn("API Error, using dummy events", err);
//         setEvents(DUMMY_EVENTS);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // 2. Helper
//   const isUpcoming = (ev) => new Date(ev.date) > new Date();

//   // 3. Filter & Sort Logic
//   const getProcessedEvents = () => {
//     // A. Search Filter
//     let filtered = events.filter(e => {
//       const query = search.toLowerCase();
//       return e.name.toLowerCase().includes(query) ||
//         (e.venue && e.venue.toLowerCase().includes(query));
//     });

//     // B. Category Filter
//     if (filter === 'upcoming') {
//       filtered = filtered.filter(isUpcoming);
//     } else if (filter === 'past') {
//       filtered = filtered.filter(e => !isUpcoming(e));
//     }

//     // C. Sorting
//     // Upcoming: Ascending (Soonest first)
//     // Past: Descending (Most recent first)
//     // All: Descending (Newest first, regardless of past/future)
//     filtered.sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);

//       if (filter === 'upcoming') return dateA - dateB;
//       return dateB - dateA; // Default for 'past' and 'all'
//     });

//     return filtered;
//   };

//   const displayEvents = getProcessedEvents();

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8">

//       <div className="min-h-screen bg-black text-white pt-24 pb-20 font-sans">

//         {/* HEADER SECTION */}
//         <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
//           <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
//             Explore <span className="text-red-600">Events</span>
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             From groundbreaking talks to interactive workshops, discover the timeline of innovation.
//           </p>
//         </div>

//         {/* CONTROLS SECTION (Tabs + Search) */}
//         <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">

//           {/* Tabs */}
//           <div className="bg-neutral-900/80 p-1.5 rounded-full flex overflow-x-auto max-w-full border border-white/10">
//             {['all', 'upcoming', 'past'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setFilter(tab)}
//                 className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === tab
//                     ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(230,43,30,0.4)]'
//                     : 'text-gray-400 hover:text-white hover:bg-white/5'
//                   }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Search Bar */}
//           <div className="relative w-full md:w-80 group">
//             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-500 group-focus-within:text-red-600 transition-colors" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-gray-600"
//             />
//           </div>
//         </div>

//         {/* EVENTS GRID */}
//         <div className="max-w-7xl mx-auto px-6">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-20 gap-4">
//               <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
//               <div className="text-red-600 font-bold tracking-widest animate-pulse">LOADING ARCHIVES...</div>
//             </div>
//           ) : displayEvents.length === 0 ? (
//             <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-neutral-900/20">
//               <Filter size={48} className="mx-auto text-gray-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-300">No events found</h3>
//               <p className="text-gray-500">Try adjusting your search or filter.</p>
//               {filter !== 'all' && (
//                 <button onClick={() => setFilter('all')} className="mt-4 text-red-500 hover:underline">View All Events</button>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {displayEvents.map((event) => {
//                 const active = isUpcoming(event);
//                 return (
//                   <div
//                     key={event._id}
//                     onClick={() => navigate(`/events/${event.slug || event._id}`)}
//                     className="group relative bg-neutral-900 border border-white/5 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 cursor-pointer flex flex-col h-full hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.1)]"
//                   >
//                     {/* Image Container */}
//                     <div className="relative h-56 overflow-hidden">
//                       <img
//                         src={buildImg(event.banner || event.image)}
//                         alt={event.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale-[20%] group-hover:grayscale-0"
//                       />

//                       {/* Status Badge */}
//                       <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md ${active
//                           ? 'bg-red-600 text-white'
//                           : 'bg-black/60 text-gray-300 border border-white/10'
//                         }`}>
//                         {active ? 'UPCOMING' : 'COMPLETED'}
//                       </div>

//                       {/* Date Overlay (Bottom Left of Image) */}
//                       <div className="absolute bottom-0 left-0 bg-black/80 backdrop-blur px-4 py-2 rounded-tr-xl border-t border-r border-white/10 flex items-center gap-2">
//                         <Calendar size={14} className="text-red-500" />
//                         <span className="text-white text-xs font-bold uppercase tracking-wider">
//                           {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="p-6 flex-1 flex flex-col">
//                       <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors leading-tight">
//                         {event.name}
//                       </h3>

//                       <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
//                         <MapPin size={14} />
//                         <span>{event.venue || "TBA"}</span>
//                       </div>

//                       <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
//                         {event.description}
//                       </p>

//                       <div className="pt-5 border-t border-white/5 mt-auto flex items-center justify-between">
//                         <span className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-green-500' : 'text-gray-600'}`}>
//                           {active ? 'Registration Open' : 'Watch Recording'}
//                         </span>
//                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
//                           <ArrowRight size={14} className="text-gray-400 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all duration-300" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Search, Filter, ArrowRight } from "lucide-react";
import { api } from "../api";
import { buildImg } from "../utils";

/* ───────────────── IMAGE RESOLVER ───────────────── */
const resolveImage = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return buildImg(img);
};

/* ───────────────── VENUE RESOLVER ───────────────── */
const resolveVenue = (event) => {
  return (
    event?.venue ||
    event?.venueName ||
    event?.location ||
    event?.place ||
    event?.address ||
    event?.eventVenue ||
    event?.venue?.name ||
    "Venue TBA"
  );
};

/* ───────────────── DUMMY DATA ───────────────── */
const DUMMY_EVENTS = [
  {
    _id: "evt-1",
    slug: "echoes-of-innovation",
    name: "Echoes of Innovation",
    date: new Date(Date.now() + 864000000).toISOString(),
    venue: "Grand Auditorium",
    description:
      "Exploring how past reverberations shape our future technologies.",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000",
  },
  {
    _id: "evt-2",
    slug: "sustainable-horizons",
    name: "Sustainable Horizons",
    date: new Date(Date.now() + 1728000000).toISOString(),
    venue: "Green Park Center",
    description: "A deep dive into eco-friendly architecture and living.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
  },
  {
    _id: "evt-3",
    slug: "digital-frontiers",
    name: "Digital Frontiers",
    date: new Date(Date.now() - 864000000).toISOString(),
    venue: "Tech Hub",
    description: "Navigating the complexities of the metaverse and AI.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all"); // all | upcoming | past
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ───────────────── FETCH EVENTS ───────────────── */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        const data = res?.data?.success ? res.data.data : res.data;

        const normalized = Array.isArray(data)
          ? data.map((ev) => ({
              ...ev,
              venue: resolveVenue(ev),
            }))
          : [];

        setEvents(normalized.length ? normalized : DUMMY_EVENTS);
      } catch (err) {
        console.warn("API failed — using dummy events", err);
        setEvents(DUMMY_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const isUpcoming = (ev) => new Date(ev.date) > new Date();

  /* ───────────────── FILTER + SORT ───────────────── */
  const displayEvents = events
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        e.name?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q)
      );
    })
    .filter((e) => {
      if (filter === "upcoming") return isUpcoming(e);
      if (filter === "past") return !isUpcoming(e);
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      if (filter === "upcoming") return da - db;
      return db - da;
    });

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Explore <span className="text-red-600">Events</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          From groundbreaking talks to immersive experiences — explore our
          journey.
        </p>
      </div>

      {/* FILTER + SEARCH */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="bg-neutral-900/80 p-1.5 rounded-full flex border border-white/10">
          {["all", "upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-red-600/50"
          />
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-600 font-bold tracking-widest">
              LOADING EVENTS
            </span>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-24">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => {
              const active = isUpcoming(event);
              const banner = resolveImage(
                event.banner || event.image || event.bannerUrl
              );

              return (
                <div
                  key={event._id}
                  onClick={() =>
                    navigate(`/events/${event.slug || event._id}`)
                  }
                  className="group bg-neutral-900 border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-red-600/50 transition-all"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        banner ||
                        "https://images.unsplash.com/photo-1544531586-fde5298cdd40"
                      }
                      alt={event.name}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://images.unsplash.com/photo-1544531586-fde5298cdd40")
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />

                    <div
                      className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                        active
                          ? "bg-red-600 text-white"
                          : "bg-black/70 text-gray-300"
                      }`}
                    >
                      {active ? "UPCOMING" : "PAST"}
                    </div>

                    <div className="absolute bottom-0 left-0 bg-black/80 px-4 py-2 flex items-center gap-2">
                      <Calendar size={14} className="text-red-500" />
                      <span className="text-xs font-bold uppercase">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-red-500">
                      {event.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <MapPin size={14} />
                      <span>{resolveVenue(event)}</span>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                      {event.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {active ? "Register Now" : "View Event"}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-red-500 transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
