// admin/src/pages/Dashboard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Minimal Dashboard component.
 * Right now it simply redirects to the events admin page.
 * Replace this with a full dashboard/sidebar when ready.
 */
export default function Dashboard() {
  return <Navigate to="/events" replace />;
}
