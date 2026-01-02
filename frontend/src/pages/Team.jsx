import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { api } from '../api';
import { buildImg } from '../utils';

// --- DUMMY DATA FALLBACKS ---
const DUMMY_COORDINATORS = [
  {
    _id: "c1",
    name: "Dr. Anjali Sharma",
    designation: "Faculty Mentor",
    department: "Computer Science",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "c2",
    name: "Prof. Rajesh Verma",
    designation: "Faculty Advisor",
    department: "Electronics",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  },
];

const DUMMY_ORGANIZERS = [
  {
    _id: "o1",
    name: "Aryan Gupta",
    role: "Lead Organizer",
    bio: "Passionate about bringing ideas to life.",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    email: "aryan@tedxsmec.com",
  },
  {
    _id: "o2",
    name: "Sneha Reddy",
    role: "Curator",
    bio: "Curating talks that inspire change.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    instagram: "https://instagram.com",
  },
];

// ─── SOCIAL LINK RESOLVER ───────────────────
const resolveSocials = (m) => ({
  linkedin: m.linkedin || m.linkedinUrl || null,
  instagram: m.instagram || m.instagramUrl || null,
  email: m.email || m.emailId || null,
});

export default function TeamPage() {
  const [coordinators, setCoordinators] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTeam = async () => {
      try {
        const [coordRes, orgRes] = await Promise.allSettled([
          api.get('/admin/coordinators/public/list'),
          api.get('/admin/organizers/public/list'),
        ]);

        const extract = (res) =>
          res.status === 'fulfilled' && res.value?.data?.success
            ? res.value.data.data
            : res.value?.data || [];

        setCoordinators(extract(coordRes).length ? extract(coordRes) : DUMMY_COORDINATORS);
        setOrganizers(extract(orgRes).length ? extract(orgRes) : DUMMY_ORGANIZERS);
      } catch {
        setCoordinators(DUMMY_COORDINATORS);
        setOrganizers(DUMMY_ORGANIZERS);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeam();
  }, []);

  // ─── TEAM CARD ─────────────────────────────
  const TeamCard = ({ member, type }) => {
    const role =
      member.role ||
      member.designation ||
      member.department ||
      "Team Member";

    const socials = resolveSocials(member);
    const showSocials = type === "Organizer";

    return (
      <div className="group relative min-w-[280px] h-[420px] bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-500 shadow-xl snap-start">

        {/* IMAGE */}
        <div className="absolute inset-0">
          <img
            src={buildImg(member.photo)}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
        </div>

        {/* SOCIAL ICONS (ONLY ORGANIZERS, ON IMAGE) */}
        {showSocials && (
          <div className="
            absolute top-4 right-4 z-20
            flex flex-col gap-3
            opacity-0 translate-y-2
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          ">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-black/70 rounded-full hover:bg-[#0A66C2] transition"
              >
                <Linkedin size={18} className="text-white" />
              </a>
            )}

            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-black/70 rounded-full hover:bg-pink-500 transition"
              >
                <Instagram size={18} className="text-white" />
              </a>
            )}

            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="p-2 bg-black/70 rounded-full hover:bg-red-600 transition"
              >
                <Mail size={18} className="text-white" />
              </a>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-10 h-1 bg-red-600 mb-3 group-hover:w-full transition-all" />

          <h3 className="text-2xl font-bold text-white mb-1">
            {member.name}
          </h3>
          <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-3">
            {role}
          </p>

          <p className="text-gray-300 text-sm line-clamp-3">
            {member.bio || `A dedicated ${type} contributing to TEDxSMEC.`}
          </p>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-bold animate-pulse">
        LOADING TEAM...
      </div>
    );

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* FACULTY COORDINATORS */}
        <section>
          <SectionHeader index="01" title="Faculty Coordinators" />
          <HorizontalScroll>
            {coordinators.map((c, i) => (
              <TeamCard key={c._id || i} member={c} type="Coordinator" />
            ))}
          </HorizontalScroll>
        </section>

        {/* ORGANIZERS */}
        <section>
          <SectionHeader index="02" title="Organizing Team" />
          <HorizontalScroll>
            {organizers.map((o, i) => (
              <TeamCard key={o._id || i} member={o} type="Organizer" />
            ))}
          </HorizontalScroll>
        </section>

      </div>
    </div>
  );
}

/* ─── HELPERS ───────────────────────────── */

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
      <span className="text-4xl font-black text-red-600 opacity-20">
        {index}
      </span>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
  );
}

function HorizontalScroll({ children }) {
  return (
    <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
      {children}
    </div>
  );
}
