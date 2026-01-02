// import React from "react";

// // Sections
// import Hero from "../components/Hero";
// import AboutSection from "../components/AboutSection";
// import EventsSection from "../components/EventsSection";
// import SpeakersSection from "../components/SpeakersSection";
// import SponsorsSection from "../components/SponsorsSection";
// // import TeamSection from "../components/TeamSection";
// // import MediaSection from "../components/MediaSection";
// import CommunitySection from "../components/CommunitySection";
// import ContactSection from "../components/ContactSection";

// export default function Home() {
//   return (
//     <div className="bg-black text-white selection:bg-tedx-red/30">
//       <main>
//         <Hero />
//         <div className="max-w-6xl mx-auto px-4 py-8 ">
//           <AboutSection />
//           <SpeakersSection />
//           <EventsSection />
//           <SponsorsSection />
//           {/* <TeamSection /> */}
//           {/* <MediaSection /> */}
//           <CommunitySection />
//           <ContactSection />
//         </div>
//       </main>
//     </div>
//   );
// }


import React from "react";

// Sections
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import EventsSection from "../components/EventsSection";
import SpeakersSection from "../components/SpeakersSection";
import SponsorsSection from "../components/SponsorsSection";
// import TeamSection from "../components/TeamSection";
// import MediaSection from "../components/MediaSection";
import CommunitySection from "../components/CommunitySection";
import ContactSection from "../components/ContactSection";
import CountdownSection from "../components/CountdownSection";

export default function Home() {
  return (
    <div className="bg-black text-white selection:bg-tedx-red/30">
      <main>
        <Hero />
        <CountdownSection />
        <div className="max-w-6xl mx-auto px-4 py-8 ">
          <AboutSection />
          <SpeakersSection />
          <EventsSection />
          <SponsorsSection />
          {/* <TeamSection /> */}
          {/* <MediaSection /> */}
          <CommunitySection />
          <ContactSection />
        </div>
      </main>
    </div>
  );
}