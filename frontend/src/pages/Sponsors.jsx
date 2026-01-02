// import React, { useEffect, useState } from "react";
// import { api } from "../api";
// import { buildImg } from "../utils";

// export default function Sponsors() {
//   const [sponsors, setSponsors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     const endpoints = [
//       "/admin/sponsors/public/list", // primary public endpoint
//       "/sponsors"                    // fallback if you add top-level later
//     ];

//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       for (const ep of endpoints) {
//         try {
//           const res = await api.get(ep);
//           const data = res?.data?.success ? res.data.data : res.data;

//           if (!mounted) return;

//           if (Array.isArray(data)) {
//             setSponsors(data);
//             setLoading(false);
//             return;
//           }
//         } catch (err) {
//           // last attempt -> set error
//           if (endpoints.indexOf(ep) === endpoints.length - 1) {
//             console.error("Sponsors load error:", err);
//             setError(err?.response?.data?.message || err.message || "Failed to load sponsors");
//             setLoading(false);
//           }
//           // otherwise continue to next endpoint
//         }
//       }
//     };

//     load();
//     return () => { mounted = false; };
//   }, []);

//   if (loading) return <div className="p-6 text-white">Loading sponsors...</div>;
//   if (error) return <div className="p-6 bg-red-700 text-white rounded">{error}</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-red-500 mb-6">Sponsors</h1>

//       {sponsors.length === 0 && <p className="text-gray-400">No sponsors found.</p>}

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//         {sponsors.map(sp => (
//           <div key={sp._id || sp.id} className="bg-gray-900 rounded-lg shadow p-4 flex items-center justify-center border border-red-700">
//             <img
//               src={buildImg(sp.logo || sp.logoUrl)}
//               alt={sp.name}
//               className="max-h-20 object-contain"
//               onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x60/111111/ffffff?text=Sponsor'; }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// // import React from "react";
// // import SponsorsSection from "../components/SponsorsSection";

// // export default function Sponsors() {
// //   return (
// //     <div className="bg-black text-white">
// //       <main className="pt-24 px-4 max-w-6xl mx-auto">
// //         <SponsorsSection />
// //       </main>
// //     </div>
// //   );
// // }


import React, { useEffect, useState } from "react";
import { api } from "../api";
import { buildImg } from "../utils";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const endpoints = [
      "/admin/sponsors/public/list", // primary
      "/sponsors",                  // fallback
    ];

    const loadSponsors = async () => {
      setLoading(true);
      setError(null);

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;

          if (!mounted) return;

          if (Array.isArray(data)) {
            setSponsors(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          if (ep === endpoints[endpoints.length - 1]) {
            setError(
              err?.response?.data?.message ||
              err.message ||
              "Failed to load sponsors"
            );
            setLoading(false);
          }
        }
      }
    };

    loadSponsors();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-black text-white">
      <main className="pt-24 px-4 max-w-6xl mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-4xl md:text-5xl font-black text-center mb-12">
          Our <span className="text-red-600">Sponsors</span>
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="max-w-xl mx-auto bg-red-600/10 border border-red-600/30 text-red-400 text-center p-6 rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && sponsors.length === 0 && (
          <p className="text-center text-gray-400 py-20">
            No sponsors available at the moment.
          </p>
        )}

        {/* SPONSORS GRID */}
        {!loading && !error && sponsors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-20">
            {sponsors.map((sp) => (
              <div
                key={sp._id || sp.id}
                className="group bg-neutral-900/80 border border-white/10 rounded-xl
                           p-6 flex items-center justify-center
                           hover:border-red-600/50 transition-all"
              >
                <img
                  src={buildImg(sp.logo || sp.logoUrl)}
                  alt={sp.name || "Sponsor"}
                  className="max-h-20 object-contain opacity-80 group-hover:opacity-100 transition"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/160x80/111111/ffffff?text=Sponsor";
                  }}
                />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
