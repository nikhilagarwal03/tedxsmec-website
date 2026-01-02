import React, { useState } from "react";
import { 
  Mail, MapPin, Send, MessageSquare, 
  HelpCircle, ChevronDown, ChevronUp, 
  Facebook, Instagram, Twitter, Linkedin 
} from "lucide-react";

// --- FAQ DATA ---
const FAQS = [
  {
    question: "How can I apply to be a speaker?",
    answer: "We open speaker applications 3-4 months prior to the event. Keep an eye on our social media handles for the official announcement."
  },
  {
    question: "Are tickets refundable?",
    answer: "Tickets are generally non-refundable but are transferable up to 7 days before the event. Please contact us for specific cases."
  },
  {
    question: "Is there a specific dress code?",
    answer: "There is no strict dress code, but we recommend 'Smart Casual' to match the professional yet creative vibe of a TEDx event."
  },
  {
    question: "How can I become a sponsor?",
    answer: "We welcome partnerships! Please email us at tedxsmec@gmail.com with the subject line 'Sponsorship Inquiry' for a detailed brochure."
  }
];

export default function ContactPage() {
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Query', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: 'General Query', message: '' });
    }, 3000);
  };

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      
      {/* 1. HERO HEADER */}
      <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Touch</span>
        </h1>
        <p className="text-xl text-gray-400">
          Whether you are a potential partner, a future speaker, or an attendee, we are here to listen.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* --- LEFT COLUMN: INFO & FAQ --- */}
        <div className="space-y-12">
          
          {/* DIRECT CONTACT CHANNELS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-red-600" size={24} />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Official Email Card */}
              <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-xl hover:border-red-600/30 transition-all flex items-center gap-5">
                <div className="p-3 bg-red-600/10 rounded-full text-red-600">
                    <Mail size={28} />
                </div>
                <div>
                    <h4 className="font-bold text-white mb-1">Official Email</h4>
                    <p className="text-xs text-gray-500 mb-1">For all inquiries (Sponsors, Speakers, General)</p>
                    <a href="mailto:tedxsmec@gmail.com" className="text-lg font-bold text-white hover:text-red-500 transition-colors">
                        tedxsmec@gmail.com
                    </a>
                </div>
              </div>

              {/* Address / Venue Block */}
              <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-xl flex items-start gap-5">
                 <div className="p-3 bg-red-600/10 rounded-full text-red-600 shrink-0">
                    <MapPin size={28} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white mb-1">Event Venue</h4>
                   <p className="text-gray-400 text-sm leading-relaxed font-medium">
                     St. Martin's Engineering College (SMEC)<br />
                     Dhulapally, Secunderabad<br />
                     Telangana 500100, India.
                   </p>
                   <a href="https://maps.google.com/?q=St+Martins+Engineering+College" target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white underline decoration-red-600/50">
                      Get Directions
                   </a>
                 </div>
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA FOLLOW */}
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-white">Follow Us On Socials</h3>
             <div className="flex gap-4">
                {[
                  { Icon: Instagram, link: "#", color: "hover:text-pink-500" },
                  { Icon: Facebook, link: "#", color: "hover:text-blue-500" },
                  { Icon: Twitter, link: "#", color: "hover:text-sky-500" },
                  { Icon: Linkedin, link: "#", color: "hover:text-blue-400" }
                ].map((social, i) => (
                    <a 
                        key={i} 
                        href={social.link} 
                        target="_blank"
                        rel="noreferrer"
                        className={`p-4 bg-white/5 border border-white/5 rounded-xl text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-white/10 ${social.color}`}
                    >
                        <social.Icon size={24} />
                    </a>
                ))}
             </div>
          </div>

          {/* VENUE MAP (Moved into left column) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-red-600" size={24} />
              Venue Map
            </h3>
            <div className="bg-neutral-900/30 border border-white/5 rounded-xl overflow-hidden">
              <div className="h-64 w-full grayscale invert filter hover:grayscale-0 hover:invert-0 transition-all duration-700">
                <iframe
                  src="https://maps.google.com/maps?q=St.+Martin's+Engineering+College+Dhulapally&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="SMEC Location"
                />
              </div>
              <div className="p-4 border-t border-white/5 bg-neutral-900/50">
                <a href="https://maps.google.com/?q=St+Martins+Engineering+College" target="_blank" rel="noreferrer" className="inline-block text-sm font-bold uppercase tracking-wider text-white/70 hover:text-white underline decoration-red-600/50">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: INTERACTIVE FORM --- */}
        <div className="relative">
          <div className="sticky top-32 p-8 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-gray-400 text-sm">Thank you for reaching out to TEDxSMEC. <br/>We will reply to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Subject</label>
                    <div className="relative">
                      <select 
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none appearance-none cursor-pointer"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      >
                          <option>General Inquiry</option>
                          <option>Sponsorship Opportunity</option>
                          <option>Speaker Application</option>
                          <option>Technical Issue</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Message Area */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Message</label>
                    <textarea 
                        rows={5}
                        required
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all resize-none"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                >
                    <span>Send Message</span>
                    <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      {/* FAQ SECTION (moved to bottom) */}
      <div className="w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <HelpCircle className="text-red-600" size={24} />
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-neutral-900/30 border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-gray-200">{faq.question}</span>
                  {openFaq === idx ? <ChevronUp size={18} className="text-red-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 bg-neutral-900/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}