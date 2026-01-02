// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Image as ImageIcon, Users } from "lucide-react";
// import TeamSection from "./TeamSection"; 

// export default function CommunitySection() {
//   return (
//     <section className="relative py-20 bg-black overflow-hidden border-t border-white/5">
      
//       {/* Background Ambience - Toned down for cleaner look */}
//       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
//           {/* --- LEFT: TEAM CAROUSEL (RESIZED - 5 Cols) --- */}
//           <div className="relative order-1 lg:order-1 lg:col-span-5">
//               <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-500">
//                 <TeamSection /> 
//               </div>

//               {/* Decorative Borders - Adjusted to hug the card tighter */}
//               <div className="absolute -top-3 -left-3 w-20 h-20 border-t border-l border-red-600/30 rounded-tl-2xl -z-0" />
//               <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b border-r border-red-600/30 rounded-br-2xl -z-0" />
//           </div>

//           {/* --- RIGHT: TEXT CONTENT (RESIZED - 7 Cols) --- */}
//           <div className="text-center lg:text-left order-2 lg:order-2 lg:col-span-7">
              
//               {/* Badge */}
//               <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-600/30 rounded-full bg-red-900/10 mb-6">
//                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
//                  <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
//                    Community & Leadership
//                  </span>
//               </div>
              
//               {/* Heading - Resized for better readability */}
//               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-[1.1]">
//                   Of the Students,<br />
//                   By the Students,<br />
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
//                       For the World.
//                   </span>
//               </h2>
              
//               {/* Description - Improved readability with max-width */}
//               <div className="space-y-4 text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
//                   <p>
//                      TEDxSMEC is a movement fueled by the relentless energy of our student community. It's where passion meets execution.
//                   </p>
//                   <p>
//                      Every pixel on the screen, every light on the stage, and every speaker curated is the result of months of dedication by our 
//                      <span className="text-white font-medium"> Faculty Coordinators</span> and <span className="text-white font-medium">Student Organizers</span>.
//                   </p>
//               </div>

//               {/* CTAs - Compact styling */}
//               <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
//                   <Link 
//                       to="/team" 
//                       className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 group"
//                   >
//                       <Users size={18} />
//                       <span>Meet the Team</span>
//                       <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                   </Link>

//                   <Link 
//                       to="/gallery" 
//                       className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-gray-300 font-semibold rounded-lg transition-all hover:bg-white/5 hover:text-white"
//                   >
//                       <ImageIcon size={18} />
//                       <span>View Gallery</span>
//                   </Link>
//               </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Users } from "lucide-react";
import TeamSection from "./TeamSection"; 

export default function CommunitySection() {
  return (
    <section className="relative py-10 sm:py-14 md:py-18 bg-black overflow-hidden border-t border-white/5">
      
      {/* Background Ambience - Toned down for cleaner look */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-red-600/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* --- LEFT: TEAM CAROUSEL (RESIZED - 5 Cols) --- */}
          <div className="relative order-1 lg:order-1 lg:col-span-5 flex justify-center">
              <div className="relative z-10 w-full max-w-sm md:max-w-md transform transition-transform hover:scale-[1.02] duration-500">
                <TeamSection /> 
              </div>

              {/* Decorative Borders - Adjusted to hug the card tighter */}
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t border-l border-red-600/30 rounded-tl-2xl -z-0" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b border-r border-red-600/30 rounded-br-2xl -z-0" />
          </div>

          {/* --- RIGHT: TEXT CONTENT (RESIZED - 7 Cols) --- */}
            <div className="text-center lg:text-left order-2 lg:order-2 lg:col-span-7">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-600/30 rounded-full bg-red-900/10 mb-6">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
               <span className="eyebrow text-red-500">
                   Community & Leadership
                 </span>
              </div>
              
              {/* Heading - Resized for better readability */}
                <h2 className="heading-section mb-4">
                  Of the Students,<br />
                  By the Students,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                      For the Students.
                  </span>
              </h2>
              
              {/* Description - Improved readability with max-width */}
                <div className="space-y-3 text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                  <p>
                     TEDxSMEC is a movement fueled by the relentless energy of our student community. It's where passion meets execution.
                  </p>
                  <p>
                     Every pixel on the screen, every light on the stage, and every speaker curated is the result of months of dedication by our 
                    <span className="text-white font-medium"> Faculty Coordinators</span> and <span className="text-white font-medium"> Student Organizers</span>.
                  </p>
              </div>

              {/* CTAs - Compact styling */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link 
                      to="/team" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full uppercase tracking-wide text-[10px] sm:text-[11px] transition-all shadow-lg shadow-red-900/20 group"
                  >
                  <Users size={18} className="sm:w-5 sm:h-5" />
                  <span>Meet the Team</span>
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                      to="/gallery" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 border border-white/10 text-white font-semibold rounded-full uppercase tracking-wide text-[10px] sm:text-[11px] transition-all hover:bg-white/5"
                  >
                  <ImageIcon size={18} className="sm:w-5 sm:h-5" />
                      <span>View Gallery</span>
                  </Link>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
}