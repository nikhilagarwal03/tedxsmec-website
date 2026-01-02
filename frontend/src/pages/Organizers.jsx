import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { buildImg } from "../utils";

export default function Organizers() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = [
      "/admin/organizers/public/list", // primary public endpoint
      "/organizers"                    // fallback
    ];

    const load = async () => {
      setLoading(true);
      setError(null);

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;
          if (!mounted) return;
          if (Array.isArray(data)) {
            setOrgs(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error("Organizers load error:", err);
            setError(err?.response?.data?.message || err.message || "Failed to load organizers");
            setLoading(false);
          }
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-white">Loading organizers...</div>;
  if (error) return <div className="p-6 bg-red-700 text-white rounded">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Organizers</h1>

      {orgs.length === 0 && <p className="text-gray-400">No organizers found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {orgs.map(o => (
          <div key={o._id || o.id} className="bg-gray-900 rounded-lg shadow p-5 text-center border border-red-700">
            <img
              src={buildImg(o.photo)}
              alt={o.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200/111111/ffffff?text=Organizer'; }}
            />
            <h2 className="font-semibold text-lg text-white">{o.name}</h2>
            <p className="text-sm text-gray-400">{o.role}</p>
            <p className="text-sm mt-2 text-gray-300 line-clamp-3">{o.bio}</p>
            <div className="mt-3">
              <Link to={`/organizers/${o._id || o.id}`} className="text-red-400 hover:underline text-sm">View Profile →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
