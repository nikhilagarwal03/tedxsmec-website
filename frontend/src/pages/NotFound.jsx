// frontend/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-black text-white">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold text-red-400 mb-4">404</h1>
        <p className="text-lg text-gray-300 mb-6">Page not found. The link may be broken or the page has been moved.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-red-600 text-white rounded">Home</Link>
          <Link to="/events" className="px-4 py-2 border border-gray-700 text-gray-300 rounded">Events</Link>
        </div>
      </div>
    </div>
  );
}
