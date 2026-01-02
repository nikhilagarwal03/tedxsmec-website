// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Mail, Mic } from "lucide-react";

// export default function ContactSection() {
//   return (
//     <section className="relative py-20 bg-black overflow-hidden border-t border-white/10">
      
//       {/* Background Glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/20 blur-[100px] rounded-full pointer-events-none" />

//       <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
//         <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
//           Ready to Spark a <span className="text-red-600">Conversation?</span>
//         </h2>
        
//         <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
//           Whether you are a creator with an idea, a brand looking to partner, or an attendee with a question—we are listening.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           {/* Primary CTA: Go to Contact Page */}
//           <Link 
//             to="/contact" 
//             className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 hover:shadow-red-900/40 group"
//           >
//               <Mail size={20} />
//               <span>Get in Touch</span>
//               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </Link>

//           {/* Secondary CTA: Speaker Application (or just a nudge) */}
//           <Link 
//             to="/contact" 
//             className="group px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-red-600/30 transition-all w-full sm:w-auto"
//           >
//             <span className="flex items-center justify-center gap-2">
//               <Mic size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
//               <span>Apply to Speak</span>
//             </span>
//           </Link>

//         </div>
//       </div>

//     </section>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Mic } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-black overflow-hidden border-t border-white/10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        <h2 className="heading-section mb-4 sm:mb-6">
          Ready to Spark a <span className="text-red-600">Conversation?</span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          Whether you are a creator with an idea, a brand looking to partner, or an attendee with a question—we are listening.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          {/* Primary CTA: Go to Contact Page */}
          <Link 
            to="/contact" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 hover:shadow-red-900/40 group"
          >
              <Mail size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Get in Touch</span>
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary CTA: Speaker Application (or just a nudge) */}
          <Link 
            to="/contact" 
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-red-600/30 transition-all w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Mic size={18} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm sm:text-base">Apply to Speak</span>
            </span>
          </Link>

        </div>
      </div>

    </section>
  );
}