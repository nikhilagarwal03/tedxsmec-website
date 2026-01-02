// import React from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Visual from "./ui/Visual"; 

// export default function Hero({ onNavigate }) {
//   const handleNavigateTo = (id) => {
//     if (typeof onNavigate === "function") {
//       onNavigate(id);
//       return;
//     }
//     const el = document.getElementById(id);
//     if (!el) return;
//     const navbarHeight = document.getElementById("navbar")?.offsetHeight || 80;
//     const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
//     window.scrollTo({ top, behavior: "smooth" });
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2, delayChildren: 0.3 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
//   };

//   return (
//     // Changed min-h-screen to min-h-[100dvh] for mobile browsers
//     <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black font-sans">
      
//       <Visual />

//       {/* Gradient adjus   for better mobile text contrast */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.5)_0%,_#000000_100%)] z-1" />

//       {/* Padding: px-4 on mobile, px-6 on larger */}
//       <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        
//         <motion.div 
//           className="text-center" 
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Theme Label */}
//           <motion.div variants={itemVariants} className="mb-4 sm:mb-6 inline-block">
//             <span className="py-1 px-3 sm:px-4 border border-red-600/30 rounded-full text-red-500 text-sm sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-black/50 backdrop-blur-md">
//               Theme 2026
//             </span>
//           </motion.div>

//           {/* Main Title - Responsive sizing */}
//           <motion.h1 variants={itemVariants} className="font-black tracking-tighter leading-none text-white drop-shadow-2xl">
//             {/* Break words on very small screens if necessary, though normally short enough */}
//             <div className="text-6xl sm:text-7xl lg:text-7xl inline-block">
//               <span className="text-[#E62B1E]">Echoes</span> 
              
//               {/* Connector 'of' scales with the main text */}
//               <span className="text-gray-500 font-serif italic font-light text-3xl sm:text-4xl lg:text-6xl align-middle mx-2 sm:mx-4">of</span> 
//               <div>

//               <span className="text-white">Innovation</span>
//               </div>
//             </div>
//           </motion.h1>

//           {/* Paragraph - Smaller text and tighter width on mobile */}
//           <motion.p variants={itemVariants} className="mt-6 sm:mt-8 text-gray-300 text-lg sm:text-xl max-w-xs sm:max-w-2xl mx-auto leading-relaxed font-light">
//             Exploration of the <span className="text-white font-medium border-b border-red-600/50">reverberations</span> of today's breakthroughs 
//             and how they shape the silence of tomorrow.
//           </motion.p>

//           {/* Buttons - Stack vertically on mobile, row on desktop */}
//           <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 sm:mt-12 justify-center items-center w-full sm:w-auto px-6 sm:px-0">
            
//             <Link
//               to="/events"
//               className="group w-full sm:w-auto relative px-6 sm:px-10 py-3 sm:py-4 bg-red-600 text-white font-bold rounded-xl font-medium hover:bg-[#c41e12] transition-all duration-300 shadow-[0_0_20px_rgba(230,43,30,0.4)] hover:shadow-[0_0_40px_rgba(230,43,30,0.6)]"
//             >  
//               <span className="block uppercase tracking-wider text-sm sm:text-sm">Register Now</span>
//             </Link>

//             <Link
//               to ="/speakers"
//               className="group w-full sm:w-auto relative px-6 sm:px-10 py-3 sm:py-4 border border-red-600 text-white font-bold rounded-xl font-medium hover:bg-[#c41e12] transition-all duration-300 shadow-[0_0_20px_rgba(230,43,30,0.4)] hover:shadow-[0_0_40px_rgba(230,43,30,0.6)]"
//             >
//               <span className="block uppercase tracking-wider text-sm sm:text-sm">Speakers</span>
//             </Link>

//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }


import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Visual from "./ui/Visual";

export default function Hero({ onNavigate }) {
  const handleNavigateTo = (id) => {
    if (typeof onNavigate === "function") {
      onNavigate(id);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = document.getElementById("navbar")?.offsetHeight || 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black font-sans">
      <Visual />

      {/* Gradient adjus   for better mobile text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-[1] pointer-events-none" />
      {/* Padding: px-4 on mobile, px-6 on larger */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Theme Label */}
          <motion.div variants={itemVariants} className="mb-4 sm:mb-6 inline-block">
            <span className="py-1 px-3 sm:px-4 border border-red-600/30 rounded-full text-red-500 text-sm sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-black/50 backdrop-blur-md">
              Theme 2026
            </span>
          </motion.div>

          {/* Main Title - Responsive sizing */}
          <motion.h1 variants={itemVariants} className="font-black tracking-tighter leading-none text-white drop-shadow-2xl">
            {/* Break words on very small screens if necessary, though normally short enough */}
            <div className="text-5xl sm:text-8xl lg:text-8xl inline-block">
              <span className="text-[#E62B1E]">ECHOES</span>
              <span className="text-gray-500 font-serif italic font-light text-3xl sm:text-4xl lg:text-6xl align-middle mx-2 sm:mx-4">of</span>
              <div>
                <span className="text-white">INNOVATION</span>
              </div>
            </div>
          </motion.h1>

          {/* Paragraph - Smaller text and tighter width on mobile */}
          <motion.p variants={itemVariants} className="mt-6 sm:mt-8 text-gray-300 text-lg sm:text-xl max-w-xs sm:max-w-2xl mx-auto leading-relaxed font-light">
            Exploration of the <span className="text-white font-medium border-b border-red-600/50">reverberations</span> of today's breakthroughs
            and how they shape the silence of tomorrow.
          </motion.p>

          {/* Buttons - Stack vertically on mobile, row on desktop */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-12 sm:mt-16 justify-center items-stretch sm:items-center w-full max-w-md sm:max-w-none mx-auto">
          <Link
            to="/events"
            className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-red-600 text-white font-black rounded-full hover:bg-white hover:text-red-600 transition-all duration-500 shadow-[0_10px_30px_rgba(230,43,30,0.4)] uppercase tracking-widest text-xs sm:text-sm text-center"
          >  
            Register Now
          </Link>
          <Link
            to="/speakers"
            className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 border-2 border-white text-white font-black rounded-full hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-widest text-xs sm:text-sm text-center"
          >
            Explore Speakers
          </Link>
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}