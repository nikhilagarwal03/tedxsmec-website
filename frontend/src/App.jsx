// // // // frontend/src/App.jsx
// // // import React, { useState } from "react";
// // // import { Outlet } from "react-router-dom";
// // // import Navbar from "./components/Navbar";
// // // import Footer from "./components/Footer";
// // // import Preloader from "./components/Preloader";

// // // export default function App() {
// // //   const [loading, setLoading] = useState(true);

// // //   const handlePreloaderFinish = () => {
// // //     setLoading(false);
// // //   };

// // //   if (loading) {
// // //     return <Preloader onFinish={handlePreloaderFinish} />;
// // //   }

// // //   const handleNavigate = (sectionId) => {
// // //     const el = document.getElementById(sectionId);
// // //     if (!el) return;
// // //     const navbarHeight = document.getElementById("navbar")?.offsetHeight || 80;
// // //     const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
// // //     window.scrollTo({ top, behavior: "smooth" });
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-black text-white selection:bg-tedx-red/30">
// // //       <Navbar onNavigate={handleNavigate} id="navbar" />

// // //       <main className="max-w-6xl mx-auto px-4 py-8">
// // //         <Outlet />
// // //       </main>

// // //       <Footer onNavigate={handleNavigate} />
// // //     </div>
// // //   );
// // // }


// // // frontend/src/App.jsx
// // import React, { useState,useEffect, useRef } from "react";
// // import { Outlet } from "react-router-dom";
// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";
// // import Preloader from "./components/Preloader";
// // import Lenis from 'lenis';

// // export default function App() {
// //   const lenisRef = useRef(null);
// //   const rafRef = useRef(null);
// //   useEffect(() => {
// //     const lenis = new Lenis({
// //       duration: 1.5,
// //       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
// //       smoothWheel: true,
// //     });
// //     lenisRef.current = lenis; 

// //     function raf(time) {
// //       lenis.raf(time);
// //       rafRef.current = requestAnimationFrame(raf);
// //     }

// //     rafRef.current = requestAnimationFrame(raf);

// //     return () => {
// //       if (rafRef.current) cancelAnimationFrame(rafRef.current);
// //       lenis.destroy();
// //       lenisRef.current = null;
// //     };
// //   }, []);

// //   const [loading, setLoading] = useState(true);

// //   const handlePreloaderFinish = () => {
// //     setLoading(false);
// //   };

// //   if (loading) {
// //     return <Preloader onFinish={handlePreloaderFinish} />;
// //   }

// //   const handleNavigate = (sectionId) => {
// //     const el = document.getElementById(sectionId);
// //     if (!el) return;
// //     const navbarHeight = document.getElementById("navbar")?.offsetHeight || 80;
// //     // Prefer Lenis scroll for consistency; fallback to instant jump
// //     if (lenisRef.current) {
// //       lenisRef.current.scrollTo(el, { offset: -navbarHeight });
// //     } else {
// //       const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
// //       window.scrollTo({ top });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-black text-white selection:bg-tedx-red/30">
// //       <Navbar onNavigate={handleNavigate} id="navbar" />

// //       <main>
// //         <Outlet />
// //       </main>

// //       <Footer onNavigate={handleNavigate} />
// //     </div>
// //   );
// // }



import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import Lenis from "lenis";

export default function App() {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  /* ================= LENIS INIT ================= */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ================= PRELOADER ================= */
  const [loading, setLoading] = useState(true);
  const finishedRef = useRef(false);

  const handlePreloaderFinish = () => {
    if (finishedRef.current) return; // prevent double calls
    finishedRef.current = true;
    setLoading(false);
  };

  // 🛡️ SAFETY FALLBACK (CRITICAL FOR PRODUCTION)
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      handlePreloaderFinish();
    }, 4000); // 4 seconds max

    return () => clearTimeout(safetyTimeout);
  }, []);

  if (loading) {
    return <Preloader onFinish={handlePreloaderFinish} />;
  }

  /* ================= SCROLL NAV ================= */
  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const navbarHeight =
      document.getElementById("navbar")?.offsetHeight || 80;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -navbarHeight });
    } else {
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({ top });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-tedx-red/30">
      <Navbar onNavigate={handleNavigate} id="navbar" />

      <main>
        <Outlet />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}





  