import React, { useEffect, useState } from "react";
import { api } from "../api";
import { buildImg } from "../utils";

export default function Coordinators() {
  const [coords, setCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Public endpoints that actually exist
    const endpoints = [
      "/admin/coordinators/public/list",  // MAIN public endpoint
      "/coordinators",                    // fallback (your old one)
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
            setCoords(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          // try next endpoint
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            setError("Failed to load coordinators");
            setLoading(false);
          }
        }
      }
    };

    load();
    return () => { mounted = false };
  }, []);

  if (loading)
    return <div className="p-6 text-white">Loading coordinators...</div>;

  if (error)
    return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Faculty Coordinators</h1>

      {coords.length === 0 && (
        <p className="text-gray-400">No coordinators found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {coords.map((c) => (
          <div
            key={c._id}
            className="bg-gray-900 rounded-lg shadow p-5 text-center border border-red-700"
          >
            <img
              src={buildImg(c.photo)}
              alt={c.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/200x200")
              }
            />
            <h2 className="font-semibold text-lg text-white">{c.name}</h2>
            <p className="text-sm text-gray-400">{c.department}</p>
            <p className="text-sm mt-2 text-gray-300 line-clamp-3">
              {c.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
