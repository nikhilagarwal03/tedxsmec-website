import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <nav className="space-y-2">
          <Link to="/admin/events" className="block hover:bg-gray-800 p-2 rounded">
            Events
          </Link>

          <Link to="/admin/events/new" className="block hover:bg-gray-800 p-2 rounded">
            Create Event
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
