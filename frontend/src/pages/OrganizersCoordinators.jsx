// src/pages/OrganizersCoordinators.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { api } from '../api';
import { buildImg } from '../utils';

/**
 * OrganizersPage
 * - Uses the same card / team-style visual as your TeamSection
 * - Fetches from public organizers endpoints with a fallback
 */
export function OrganizersPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = ['/admin/organizers/public/list', '/organizers'];

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
          // continue to next endpoint, but if last, show error
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error('Organizers load error:', err);
            setError(err?.response?.data?.message || err.message || 'Failed to load organizers');
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
    <section className="py-20 bg-gradient-to-br from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Meet Our <span className="text-red-600">Organizers</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">The people making TEDxSMEC happen</p>
        </div>

        {orgs.length === 0 ? (
          <p className="text-center text-gray-400">No organizers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {orgs.map((o) => {
              const id = o._id || o.id || o.slug || o.name;
              return (
                <div
                  key={id}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={buildImg(o.photo)}
                      alt={o.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/111827/ffffff?text=Organizer'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-600 transition-colors">{o.name}</h3>
                      <p className="text-sm text-gray-300">{o.role || o.designation}</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <h3 className="text-2xl font-bold text-white">{o.name}</h3>
                    <p className="text-red-600 font-semibold">{o.role || o.designation}</p>
                    {o.bio && <p className="text-gray-300 text-sm line-clamp-4">{o.bio}</p>}

                    <div className="flex gap-3 mt-3">
                      {o.email && (
                        <a href={`mailto:${o.email}`} onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Mail size={18} className="text-white" />
                        </a>
                      )}
                      {o.linkedin && (
                        <a href={o.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Linkedin size={18} className="text-white" />
                        </a>
                      )}
                      {o.twitter && (
                        <a href={o.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Twitter size={18} className="text-white" />
                        </a>
                      )}
                    </div>

                    <div className="mt-3">
                      <Link to={`/organizers/${o._id || o.id}`} onClick={(e) => e.stopPropagation()} className="text-red-400 hover:underline text-sm">
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * CoordinatorsPage
 * - Same visual layout but for faculty coordinators
 * - Attempts public endpoints with fallback
 */
export function CoordinatorsPage() {
  const [coords, setCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = ['/admin/coordinators/public/list', '/coordinators'];

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
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error('Coordinators load error:', err);
            setError(err?.response?.data?.message || err.message || 'Failed to load coordinators');
            setLoading(false);
          }
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-white">Loading coordinators...</div>;
  if (error) return <div className="p-6 bg-red-700 text-white rounded">{error}</div>;

  return (
    <section className="py-20 bg-gradient-to-br from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Faculty <span className="text-red-600">Coordinators</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Our faculty mentors who guide the chapter</p>
        </div>

        {coords.length === 0 ? (
          <p className="text-center text-gray-400">No coordinators found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {coords.map((c) => {
              const id = c._id || c.id || c.slug || c.name;
              return (
                <div
                  key={id}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={buildImg(c.photo)}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/111827/ffffff?text=Coordinator'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-600 transition-colors">{c.name}</h3>
                      <p className="text-sm text-gray-300">{c.department || c.designation}</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <h3 className="text-2xl font-bold text-white">{c.name}</h3>
                    <p className="text-red-600 font-semibold">{c.department || c.designation}</p>
                    {c.bio && <p className="text-gray-300 text-sm line-clamp-4">{c.bio}</p>}

                    <div className="flex gap-3 mt-3">
                      {c.email && (
                        <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Mail size={18} className="text-white" />
                        </a>
                      )}
                      {c.linkedin && (
                        <a href={c.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Linkedin size={18} className="text-white" />
                        </a>
                      )}
                      {c.twitter && (
                        <a href={c.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition-colors">
                          <Twitter size={18} className="text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default OrganizersPage;
