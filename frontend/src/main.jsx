// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// console.log("MAIN.JSX LOADED");

// import ScrollToTop from "./components/ScrollToTop";
// import App from './App';
// // Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Speakers from './pages/Speakers';
// import SpeakerProfile from './pages/SpeakerProfile';
// import Events from './pages/Events';
// import EventDetail from './pages/EventDetail';
// import Sponsors from './pages/Sponsors';
// import Team from './pages/Team';
// import Gallery from './pages/Gallery';
// import Contact from './pages/Contact';
// import NotFound from './pages/NotFound';
// // import BookingForm from './components/BookingModal';
// import BookingForm from './pages/BookingPage';

// import './index.css';

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<App />}>
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />

//           <Route path="speakers" element={<Speakers />} />
//           <Route path="speakers/:id" element={<SpeakerProfile />} />

//           <Route path="events" element={<Events />} />
//           <Route path="events/:slug" element={<EventDetail />} />

//           <Route path="sponsors" element={<Sponsors />} />
//           <Route path="team" element={<Team />} />
//           <Route path="gallery" element={<Gallery />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="events/:slug/book" element={<BookingForm />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );


// // import ReactDOM from "react-dom/client";

// // ReactDOM.createRoot(document.getElementById("root")).innerHTML =
// //   "<h1 style='color:red'>PROD JS WORKS</h1>";



import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';  // ✅ Changed to HashRouter
import ScrollToTop from "./components/ScrollToTop";
import App from './App';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Speakers from './pages/Speakers';
import SpeakerProfile from './pages/SpeakerProfile';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Sponsors from './pages/Sponsors';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import BookingForm from './pages/BookingPage';

import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>  {/* ✅ Changed from BrowserRouter */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="speakers" element={<Speakers />} />
          <Route path="speakers/:id" element={<SpeakerProfile />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetail />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="team" element={<Team />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events/:slug/book" element={<BookingForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);