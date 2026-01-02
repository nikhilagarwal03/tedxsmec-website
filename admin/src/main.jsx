// admin/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import MediaLibrary from './pages/MediaLibrary';



import App from './App';
import './index.css';

// Events
import EventsAdmin from './pages/EventsAdmin';
import AdminEventForm from './pages/AdminEventForm';
import EventMapping from './pages/EventMapping';

// Speakers
import SpeakersAdmin from './pages/SpeakersAdmin';
import SpeakerForm from './pages/SpeakerForm';

// Sponsors/Organizers/Coordinators (add files similarly)
import SponsorsAdmin from './pages/SponsorsAdmin';
import SponsorForm from './pages/SponsorForm';
import OrganizersAdmin from './pages/OrganizersAdmin';
import OrganizerForm from './pages/OrganizerForm';
import CoordinatorsAdmin from './pages/CoordinatorsAdmin';
import CoordinatorForm from './pages/CoordinatorForm';

import Bookings from "./pages/Bookings";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>

      {/* Public login */}
      <Route path="/" element={<Login />} />

      {/* Admin pages under /admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="events" replace />} />

        {/* Events */}
        <Route path="events" element={<EventsAdmin />} />
        <Route path="events/new" element={<AdminEventForm />} />
        <Route path="events/edit/:eventId" element={<AdminEventForm />} />
        <Route path="events/map/:eventId" element={<EventMapping />} />

        {/* Speakers */}
        <Route path="speakers" element={<SpeakersAdmin />} />
        <Route path="speakers/new" element={<SpeakerForm />} />
        <Route path="speakers/edit/:speakerId" element={<SpeakerForm />} />

        {/* Sponsors */}
        <Route path="sponsors" element={<SponsorsAdmin />} />
        <Route path="sponsors/new" element={<SponsorForm />} />
        <Route path="sponsors/edit/:sponsorId" element={<SponsorForm />} />

        {/* Organizers */}
        <Route path="organizers" element={<OrganizersAdmin />} />
        <Route path="organizers/new" element={<OrganizerForm />} />
        <Route path="organizers/edit/:organizerId" element={<OrganizerForm />} />

        {/* Coordinators */}
        <Route path="coordinators" element={<CoordinatorsAdmin />} />
        <Route path="coordinators/new" element={<CoordinatorForm />} />
        <Route path="coordinators/edit/:coordinatorId" element={<CoordinatorForm />} />

        {/* Map (optional unified mapping UI) */}
        <Route path="map" element={<div>Map UI (coming soon)</div>} />


        <Route path="media" element={<MediaLibrary/>} />

        <Route path="/admin/bookings" element={<Bookings />} />

        
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
