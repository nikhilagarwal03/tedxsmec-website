import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Lock Body Scroll ---------------- */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  /* ---------------- Close on Route Change ---------------- */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Speakers", path: "/speakers" },
    { name: "Events", path: "/events" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "Team", path: "/team" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav
        id="navbar"
        // FIX: When menu is open, Nav jumps to z-[120] to sit ABOVE the overlay (z-[100])
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMobileMenuOpen ? "z-[120]" : "z-50"
          } ${isScrolled || isMobileMenuOpen
            ? "bg-black/90 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
          }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-full">

          {/* LOGO */}
          <Link to="/" className="flex flex-col group select-none relative z-[120]">
            <div className="flex items-baseline leading-none">
              <div>
                <span className="text-[#E62B1E] font-black text-3xl md:text-3xl tracking-tighter">TED </span>
              </div>
              <span className="text-[#E62B1E] font-bold text-2xl md:text-2xl relative -top-2 mx-[1px]">x</span>
              <span className="text-white font-black text-3xl md:text-3xl tracking-tight ml-1">SMEC</span>
            </div>
            <div className="text-white/60 text-[9px] font-medium tracking-wide mt-1">
              <span className="text-[#E62B1E] font-bold">x</span> = independently organized TED event
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${isActive(link.path)
                    ? "text-[#E62B1E]"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E62B1E] rounded-full" />
                )}
              </Link>
            ))}
            <Link
              to="/events"
              className="ml-4 px-6 py-2.5 bg-[#E62B1E] hover:bg-[#c41e12] text-white text-sm font-bold uppercase rounded transition-all duration-300 shadow-[0_0_15px_rgba(230,43,30,0.3)] hover:shadow-[0_0_25px_rgba(230,43,30,0.5)]"
            >
              REGISTER NOW
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON - Now clearly clickable */}
          <button
            className="lg:hidden relative z-[120] p-2 text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
              {/* Hamburger Icon */}
              <svg
                className={`w-8 h-8 absolute transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>

              {/* X Icon */}
              <svg
                className={`w-8 h-8 absolute transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* ---------------- MOBILE MENU OVERLAY ---------------- */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex flex-col h-[100dvh] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >

        {/* TOP BAR SPACER - Keeps links from hiding behind logo */}
        <div className="h-28 flex-shrink-0" />

        {/* CENTERED LINKS */}
        <div className="flex-1 flex flex-col items-center justify-start gap-8 overflow-y-auto py-4">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-3xl font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-110 ${isActive(link.path) ? "text-[#E62B1E]" : "text-white/80 hover:text-white"
                }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms',
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="p-8 flex-shrink-0 border-t border-white/10 bg-neutral-900/50 backdrop-blur-sm">
          <Link
            to="/events"
            className="block w-full text-center py-4 bg-[#E62B1E] active:bg-[#c41e12] text-white text-xl font-bold uppercase rounded shadow-lg shadow-red-900/30"
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </>
  );
}