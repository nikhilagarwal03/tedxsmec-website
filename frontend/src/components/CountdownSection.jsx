// // import React, { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";

// // const RollingDigit = ({ value }) => (
// //   <div className="relative h-16 w-10 sm:h-24 md:h-32 sm:w-16 md:w-20 overflow-hidden bg-neutral-900 rounded-lg flex items-center justify-center border border-white/5 shadow-inner">
// //     <AnimatePresence mode="popLayout">
// //       <motion.span
// //         key={value}
// //         initial={{ y: 40, opacity: 0 }}
// //         animate={{ y: 0, opacity: 1 }}
// //         exit={{ y: -40, opacity: 0 }}
// //         transition={{ duration: 0.5, ease: "circOut" }}
// //         className="absolute text-3xl sm:text-5xl md:text-7xl font-mono font-black text-red-600"
// //       >
// //         {value}
// //       </motion.span>
// //     </AnimatePresence>
// //   </div>
// // );

// // export default function CountdownSection() {
// //   const targetDate = new Date("2026-03-20T00:00:00"); // Set your event date here
// //   const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       const now = new Date();
// //       const diff = targetDate - now;

// //       if (diff <= 0) {
// //         clearInterval(timer);
// //         return;
// //       }

// //       const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
// //       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
// //       const mins = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0");
// //       const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");

// //       setTimeLeft({ days, hours, mins, secs });
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   }, []);

// //   return (
// //     <section className="relative py-12 sm:py-16 md:py-20 bg-black overflow-hidden border-y border-white/5">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
// //         <h2 className="eyebrow text-gray-500 mb-8 sm:mb-12">The Countdown Begins</h2>
        
// //         <div className="flex justify-center gap-3 sm:gap-6 md:gap-8 flex-wrap">
// //           {Object.entries(timeLeft).map(([label, value]) => (
// //             <div key={label} className="flex flex-col items-center">
// //               <div className="flex gap-1 sm:gap-2">
// //                 <RollingDigit value={value[0]} />
// //                 <RollingDigit value={value[1]} />
// //               </div>
// //               <span className="mt-2 sm:mt-3 md:mt-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-red-500/60">
// //                 {label}
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// /* ───────────────── Rolling Digit ───────────────── */
// const RollingDigit = ({ value }) => (
//   <div className="relative h-16 w-10 sm:h-24 md:h-32 sm:w-16 md:w-20 overflow-hidden rounded-xl
//                   bg-neutral-900/80 backdrop-blur border border-white/10
//                   shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_30px_rgba(220,38,38,0.15)]
//                   flex items-center justify-center group">

//     {/* Glow */}
//     <div className="absolute inset-0 rounded-xl bg-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

//     <AnimatePresence mode="popLayout">
//       <motion.span
//         key={value}
//         initial={{ y: 50, opacity: 0, scale: 0.9 }}
//         animate={{ y: 0, opacity: 1, scale: 1 }}
//         exit={{ y: -50, opacity: 0, scale: 0.9 }}
//         transition={{ duration: 0.45, ease: "circOut" }}
//         className="absolute text-3xl sm:text-5xl md:text-7xl font-mono font-black
//                    text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]"
//       >
//         {value}
//       </motion.span>
//     </AnimatePresence>
//   </div>
// );

// /* ───────────────── Separator ───────────────── */
// const Separator = () => (
//   <motion.div
//     animate={{ opacity: [0.4, 1, 0.4] }}
//     transition={{ duration: 1.5, repeat: Infinity }}
//     className="text-red-600 text-3xl sm:text-5xl md:text-6xl font-black mx-1 sm:mx-2"
//   >
//     :
//   </motion.div>
// );

// /* ───────────────── Countdown Section ───────────────── */
// export default function CountdownSection() {
//   const targetDate = new Date("2026-03-20T00:00:00");
//   const [timeLeft, setTimeLeft] = useState({
//     days: "00",
//     hours: "00",
//     mins: "00",
//     secs: "00",
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date();
//       const diff = targetDate - now;

//       if (diff <= 0) return;

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
//       const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
//       const mins = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0");
//       const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");

//       setTimeLeft({ days, hours, mins, secs });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative py-20 bg-black overflow-hidden border-y border-white/10">

//       {/* Animated Background Glow */}
//       <motion.div
//         aria-hidden
//         animate={{ opacity: [0.15, 0.3, 0.15] }}
//         transition={{ duration: 6, repeat: Infinity }}
//         className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25),transparent_60%)]"
//       />

//       <div className="relative max-w-7xl mx-auto px-6 text-center">

//         {/* Heading */}
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="mb-14"
//         >
//           <span className="block text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">
//             The Moment Is Near
//           </span>
//           <span className="text-4xl sm:text-5xl md:text-6xl font-black">
//             Countdown to <span className="text-red-600">TEDx</span>
//           </span>
//         </motion.h2>

//         {/* Digits */}
//         <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-8">

//           {Object.entries(timeLeft).map(([label, value], index) => (
//             <React.Fragment key={label}>
//               <div className="flex flex-col items-center">
//                 <div className="flex gap-1 sm:gap-2">
//                   <RollingDigit value={value[0]} />
//                   <RollingDigit value={value[1]} />
//                 </div>
//                 <span className="mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-red-500/70">
//                   {label}
//                 </span>
//               </div>

//               {index < 3 && <Separator />}
//             </React.Fragment>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// }


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api"; // ✅ same api instance used elsewhere

/* ───────────────── Rolling Digit ───────────────── */
const RollingDigit = ({ value }) => (
  <div className="relative h-16 w-10 sm:h-24 md:h-32 sm:w-16 md:w-20 overflow-hidden rounded-xl
                  bg-neutral-900/80 backdrop-blur border border-white/10
                  shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_30px_rgba(220,38,38,0.15)]
                  flex items-center justify-center group">
    <div className="absolute inset-0 rounded-xl bg-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.45, ease: "circOut" }}
        className="absolute text-3xl sm:text-5xl md:text-7xl font-mono font-black
                   text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

/* ───────────────── Separator ───────────────── */
const Separator = () => (
  <motion.div
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="text-red-600 text-3xl sm:text-5xl md:text-6xl font-black mx-1 sm:mx-2"
  >
    :
  </motion.div>
);

/* ───────────────── Countdown Section ───────────────── */
export default function CountdownSection() {
  const [targetDate, setTargetDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });

  /* ───── Fetch nearest upcoming event ───── */
  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const res = await api.get("/events");
        const events = res.data?.success ? res.data.data : res.data;

        if (!Array.isArray(events)) return;

        const now = new Date();

        const upcoming = events
          .filter(ev => new Date(ev.date) > now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        if (upcoming?.date) {
          setTargetDate(new Date(upcoming.date));
        }
      } catch (err) {
        console.warn("Countdown: failed to fetch event date", err);
      }
    };

    fetchUpcomingEvent();
  }, []);

  /* ───── Countdown logic ───── */
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      const mins = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0");
      const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");

      setTimeLeft({ days, hours, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) return null; // 🔥 hides section until data is ready

  return (
    <section className="relative py-20 bg-black overflow-hidden border-y border-white/10">

      {/* Background Glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25),transparent_60%)]"
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="block text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">
            Next Event Starts In
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl font-black">
            Countdown to <span className="text-red-600">TEDx</span>
          </span>
        </motion.h2>

        {/* Digits */}
        <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-8">
          {Object.entries(timeLeft).map(([label, value], index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className="flex gap-1 sm:gap-2">
                  <RollingDigit value={value[0]} />
                  <RollingDigit value={value[1]} />
                </div>
                <span className="mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-red-500/70">
                  {label}
                </span>
              </div>
              {index < 3 && <Separator />}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
