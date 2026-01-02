import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { buildImg } from "../utils";

// ─── FALLBACK (ONLY IF API FAILS) ─────────────────────────────
const DUMMY_SPONSORS = [
  {
    _id: "spon-1",
    name: "TechVision",
    category: "Title Sponsor",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    website: "https://google.com",
  },
];

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── LOAD ALL SPONSORS ──────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const loadSponsors = async () => {
      try {
        const res = await api.get("/admin/sponsors/public/list");
        const data = res?.data?.success ? res.data.data : res.data;

        // ✅ TAKE EVERYTHING BACKEND SENDS
        if (mounted && Array.isArray(data)) {
          setSponsors(data);
        }
      } catch (err) {
        console.warn("Sponsors API failed, using fallback");
        if (mounted) setSponsors(DUMMY_SPONSORS);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSponsors();
    return () => (mounted = false);
  }, []);

  // ─── DUPLICATE FOR CONTINUOUS MARQUEE ───────────────────────
  const loopList = useMemo(() => {
    if (!sponsors.length) return [];

    // duplicate ONLY for animation (not data loss)
    return sponsors.flatMap((sp, i) =>
      Array.from({ length: 4 }).map((_, idx) => ({
        ...sp,
        __loopKey: `${sp._id || sp.name}-${i}-${idx}`,
      }))
    );
  }, [sponsors]);

  if (loading || !sponsors.length) return null;

  return (
    <section
      id="sponsors"
      className="relative py-20 bg-black overflow-hidden border-t border-white/10"
    >
      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12 text-center">
        <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs block mb-3">
          Our Supporters
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Partners in <span className="text-red-500">Innovation</span>
        </h2>
      </div>

      {/* MARQUEE */}
      <div className="relative w-full overflow-hidden group py-6 z-10">
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <div className="sponsor-track flex items-center w-max gap-6 md:gap-10">
          {loopList.map((sp) => {
            const imgSrc = buildImg(sp.logo || sp.logoUrl);
            const sponsorLink = sp.website || sp.url;

            return sponsorLink ? (
              // ✅ ALL SPONSORS → CLICKABLE → NEW TAB
              <a
                key={sp.__loopKey}
                href={sponsorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-item relative flex items-center justify-center
                           w-48 h-28 md:w-64 md:h-36
                           bg-white/30 backdrop-blur-sm
                           border border-white/10 rounded-xl
                           hover:border-red-600/50 hover:bg-white/50
                           hover:shadow-[0_0_20px_rgba(220,38,38,0.25)]
                           transition-all duration-300"
              >
                <img
                  src={imgSrc}
                  alt={sp.name}
                  className="max-h-12 md:max-h-16 max-w-[75%] object-contain
                             brightness-110 drop-shadow-lg"
                />
                <div className="absolute bottom-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
                  {sp.category || "Partner"}
                </div>
              </a>
            ) : (
              <div
                key={sp.__loopKey}
                className="sponsor-item relative flex items-center justify-center
                           w-48 h-28 md:w-64 md:h-36
                           bg-white/30 backdrop-blur-sm
                           border border-white/10 rounded-xl"
              >
                <img
                  src={imgSrc}
                  alt={sp.name}
                  className="max-h-12 md:max-h-16 max-w-[75%] object-contain brightness-110"
                />
                <div className="absolute bottom-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
                  {sp.category || "Partner"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-10 text-center">
        <Link
          to="/sponsors"
          className="inline-block px-8 py-3 rounded-full
                     border border-white/10 hover:border-red-600
                     text-xs font-bold text-white uppercase tracking-widest
                     hover:bg-red-600/10 transition-all"
        >
          Become a Sponsor
        </Link>
      </div>

      {/* ANIMATION */}
      <style>{`
        .sponsor-track {
          animation: marquee 50s linear infinite;
        }
        .group:hover .sponsor-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @media (max-width: 768px) {
          .sponsor-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
}
