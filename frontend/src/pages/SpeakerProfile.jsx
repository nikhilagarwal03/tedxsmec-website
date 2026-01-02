import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Linkedin, Twitter, Instagram, 
  ArrowLeft, Quote, Share2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { buildImg } from '../utils';

export default function SpeakerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        setLoading(true);
        const endpoints = [`/admin/speakers/public/${id}`, `/speakers/${id}`];
        for (const ep of endpoints) {
          try {
            const res = await api.get(ep);
            const data = res.data?.success ? res.data.data : res.data;
            if (data) {
              setSpeaker(data);
              break;
            }
          } catch(e) { continue; }
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeaker();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-red-600 font-bold tracking-widest animate-pulse text-sm">LOADING...</div>
    </div>
  );

  if (!speaker) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
      <h2 className="text-2xl font-bold">Speaker Not Found</h2>
      <button onClick={() => navigate('/speakers')} className="text-red-500 hover:text-white transition-colors flex items-center gap-2 text-sm">
        <ArrowLeft size={16} /> Back to Directory
      </button>
    </div>
  );

  const imgSrc = buildImg(speaker.photo || speaker.image);
  const talkVideo = speaker.videoUrl || speaker.video;
  const { linkedin, twitter, instagram } = speaker.socialLinks || speaker.social || {};

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-red-600 selection:text-white pb-20">
      
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Nav Back */}
      <div className="fixed top-24 left-0 w-full z-40 px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto">
           <button 
             onClick={() => navigate('/speakers')}
             className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:border-red-600 transition-all duration-300 group"
           >
             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
             Back
           </button>
        </div>
      </div>

      <main className="pt-36 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* --- LEFT COLUMN: Image & Socials --- */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="md:sticky md:top-32 space-y-6">
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                // Restrained max-width for image so it's not huge
                className="relative aspect-[3/4] w-full max-w-sm mx-auto md:max-w-none rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900"
              >
                <img 
                  src={imgSrc} 
                  alt={speaker.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  onError={(e) => e.currentTarget.src = "https://placehold.co/600x800/111/444?text=Speaker"}
                />
              </motion.div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start gap-3">
                {[
                  { link: linkedin, Icon: Linkedin, color: "hover:bg-[#0077b5]" },
                  { link: twitter, Icon: Twitter, color: "hover:bg-black border-white" },
                  { link: instagram, Icon: Instagram, color: "hover:bg-pink-700" }
                ].map((item, i) => item.link && (
                  <a 
                    key={i} 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`p-3 bg-neutral-900 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all duration-300 ${item.color} hover:border-transparent`}
                  >
                    <item.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Content --- */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8 md:pt-4">
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {/* Smaller Name Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mb-3">
                {speaker.name}
              </h1>
              <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
                <span className="text-xl text-gray-300 font-medium">
                   {speaker.designation}
                </span>
              </div>
            </motion.div>

            {/* Talk Topic Box */}
            {speaker.talkTopic && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900/40 border border-white/10 p-6 rounded-xl relative"
              >
                 <Quote className="absolute top-4 left-4 text-red-600/20 w-8 h-8 rotate-180" />
                 <div className="relative z-10 pl-6">
                    <span className="block text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
                      The Idea
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white italic leading-tight">
                      "{speaker.talkTopic}"
                    </h3>
                 </div>
              </motion.div>
            )}

            {/* Bio */}
            {speaker.bio && (
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line text-base"
              >
                <h3 className="text-white font-bold text-xl mb-3">Biography</h3>
                {speaker.bio}
              </motion.div>
            )}

            {/* Video Section */}
            {talkVideo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} 
                className="pt-6 border-t border-white/10"
              >
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                   <div className="bg-red-600 p-1.5 rounded-full"><Play size={12} fill="white" /></div> 
                   Watch the Talk
                </h3>
                
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                  {typeof talkVideo === 'string' && (talkVideo.includes('embed') || talkVideo.includes('youtu')) ? (
                    <iframe
                      src={talkVideo}
                      title="TEDx Talk"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <a 
                      href={talkVideo} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 group hover:bg-neutral-800 transition-colors"
                    >
                       <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={24} fill="white" className="ml-1" />
                       </div>
                       <span className="mt-3 font-bold text-sm group-hover:text-red-500 transition-colors">Watch on External Site</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
