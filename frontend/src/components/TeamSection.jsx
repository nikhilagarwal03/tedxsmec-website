import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin } from "lucide-react";
import { api } from "../api";
import { buildImg } from "../utils";

// Dummy Fallback Data
const DUMMY_ALL_TEAM = [
  { _id: "d1", name: "Aryan Gupta", role: "Lead Organizer", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600" },
  { _id: "d2", name: "Sneha Reddy", role: "Curator", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600" },
  { _id: "d3", name: "Vikram Singh", role: "Tech Lead", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600" },
  { _id: "d4", name: "Neha Patel", role: "Design Head", photo: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f38?auto=format&fit=crop&q=80&w=600" },
  { _id: "d5", name: "Dr. Anjali Sharma", role: "Faculty Mentor", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" },
];

export default function TeamSection() {
  const [members, setMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        const [orgRes, coordRes] = await Promise.allSettled([
          api.get('/admin/organizers/public/list'),
          api.get('/admin/coordinators/public/list')
        ]);

        const extract = (res) => (res.status === 'fulfilled' && res.value?.data?.success) 
            ? res.value.data.data 
            : [];

        const allFetched = [...extract(orgRes), ...extract(coordRes)];

        if (allFetched.length > 0) {
          const shuffled = allFetched.sort(() => 0.5 - Math.random());
          setMembers(shuffled.slice(0, 5));
        } else {
          setMembers(DUMMY_ALL_TEAM);
        }
      } catch (err) {
        setMembers(DUMMY_ALL_TEAM);
      }
    };
    fetchAndShuffle();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (members.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [members]);

  const current = members[currentIndex] || DUMMY_ALL_TEAM[0];
  const role = current.role || current.designation || current.department || "Team Member";

  return (
    // UPDATED ASPECT RATIO: Simulates a neat portrait card
    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id || currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={buildImg(current.photo)}
            alt={current.name}
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.src = "https://placehold.co/600x800/222/FFF?text=TEDx"}
          />
          {/* Gradient: Stronger at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1"
            >
              {role}
            </motion.p>
            <motion.h3 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-black text-white leading-none mb-3"
            >
              {current.name}
            </motion.h3>

            {current.linkedin && (
               <a href={current.linkedin} target="_blank" rel="noreferrer" className="inline-flex bg-white/10 p-2 rounded-full hover:bg-red-600 transition-colors text-white backdrop-blur-md">
                 <Linkedin size={16} />
               </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators - Top Right */}
      <div className="absolute top-4 right-4 flex gap-1.5 z-10">
        {members.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-red-600' : 'w-1.5 bg-white/40'}`} 
          />
        ))}
      </div>
    </div>
  );
}