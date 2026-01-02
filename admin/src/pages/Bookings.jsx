// admin/src/pages/Bookings.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../api"; // your configured axios instance
import { X } from "lucide-react"; // optional icon, remove if not available

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", "pending", "paid", etc.

  // pagination (client side)
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // modal for details
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/bookings");
      // expecting array
      setBookings(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // fetch details when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setSelectedTicket(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      try {
        const res = await api.get(`/admin/bookings/${selectedId}`);
        if (!cancelled) setSelectedTicket(res.data);
      } catch (err) {
        console.error("detail fetch error", err);
        if (!cancelled) setSelectedTicket(null);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId]);

  // filters + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter(b => {
      if (statusFilter && String(b.status).toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (!q) return true;
      // search on name, email, phone, ticketCode, eventName
      return (
        String(b.studentName ?? b.applicantName ?? "").toLowerCase().includes(q) ||
        String(b.email ?? "").toLowerCase().includes(q) ||
        String(b.phone ?? "").toLowerCase().includes(q) ||
        String(b.ticketCode ?? "").toLowerCase().includes(q) ||
        String(b.eventName ?? "").toLowerCase().includes(q)
      );
    });
  }, [bookings, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount]);

  // helpers for downloading PDF (if backend returns base64 PDF as pdfTicketBase64 or pdfBase64)
  function downloadPdf(base64OrDataUrl, filename = "ticket.pdf") {
    if (!base64OrDataUrl) return;
    let dataUrl = base64OrDataUrl;
    if (!dataUrl.startsWith("data:")) {
      // assume raw base64 -> create data url
      dataUrl = `data:application/pdf;base64,${base64OrDataUrl}`;
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Booked Tickets</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, phone or code..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded bg-gray-900 border border-red-800 text-white placeholder-gray-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded bg-gray-900 border border-red-800 text-white"
          >
            <option value="">All statuses</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="sent">sent</option>
            <option value="cancelled">cancelled</option>
          </select>

          <button
            onClick={() => fetchBookings()}
            className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-300">Loading tickets…</div>
      ) : error ? (
        <div className="text-red-400 py-4">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-black/30 rounded border border-red-800">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-black/60">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ticket Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Booked</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.slice((page - 1) * pageSize, page * pageSize).map((b, i) => (
                  <tr key={b._id || b.id} className="hover:bg-white/2">
                    <td className="px-4 py-3 text-sm text-gray-200">{(page - 1) * pageSize + i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{b.studentName ?? b.applicantName}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{b.eventName ?? (b.eventId?.name || b.eventId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{b.ticketCode || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{b.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-200">{b.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${b.status === 'paid' ? 'bg-green-700 text-white' : b.status === 'pending' ? 'bg-yellow-700 text-white' : 'bg-gray-700 text-white'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => { setSelectedId(b._id || b.id); }}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            // copy code
                            if (!b.ticketCode) return;
                            navigator.clipboard.writeText(b.ticketCode).then(() => {
                              alert("Ticket code copied");
                            });
                          }}
                          className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white text-sm"
                        >
                          Copy Code
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-6 text-center text-gray-400">No tickets found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div className="inline-flex items-center gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50 text-white">First</button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50 text-white">Prev</button>
              <div className="px-3 py-1 text-sm text-gray-300">Page {page} / {pageCount}</div>
              <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50 text-white">Next</button>
              <button onClick={() => setPage(pageCount)} disabled={page === pageCount} className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50 text-white">Last</button>
            </div>
          </div>
        </>
      )}

      {/* DETAILS MODAL */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full border border-red-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-red-800">
              <div className="text-lg font-semibold">Ticket Details</div>
              <button onClick={() => setSelectedId(null)} className="p-2"><X className="text-white" /></button>
            </div>

            <div className="p-4">
              {detailLoading || !selectedTicket ? (
                <div className="py-8 text-center text-gray-300">Loading details…</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 flex flex-col items-center">
                      {selectedTicket.qrDataUrl ? (
                        <img src={selectedTicket.qrDataUrl} alt="QR code" className="w-48 h-48 object-contain bg-white p-2" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-900 flex items-center justify-center text-gray-500">No QR</div>
                      )}

                      <div className="mt-3 text-sm text-gray-300 text-center">
                        <div className="font-medium">{selectedTicket.ticketCode || '-'}</div>
                        <div className="text-xs text-gray-400 mt-1">{selectedTicket.status}</div>
                      </div>

                      {selectedTicket.pdfTicketBase64 && (
                        <div className="mt-3">
                          <button
                            onClick={() => downloadPdf(selectedTicket.pdfTicketBase64, `ticket-${selectedTicket.ticketCode || selectedTicket._id}.pdf`)}
                            className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                          >
                            Download PDF
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <div><strong>Name:</strong> {selectedTicket.studentName}</div>
                        {selectedTicket.rollNumber && <div><strong>Roll No:</strong> {selectedTicket.rollNumber}</div>}
                        {selectedTicket.department && <div><strong>Dept:</strong> {selectedTicket.department}</div>}
                        {selectedTicket.section && <div><strong>Section:</strong> {selectedTicket.section}</div>}
                        <div><strong>Email:</strong> {selectedTicket.email}</div>
                        <div><strong>Phone:</strong> {selectedTicket.phone}</div>
                        <div><strong>Event:</strong> {selectedTicket.eventName || (selectedTicket.eventId?.name ?? selectedTicket.eventId)}</div>
                        <div><strong>Booked At:</strong> {formatDate(selectedTicket.createdAt)}</div>

                        {/* any extra metadata */}
                        {selectedTicket.meta && (
                          <div className="mt-2">
                            <strong>Meta:</strong>
                            <pre className="text-xs text-gray-300 p-2 bg-gray-900 rounded">{JSON.stringify(selectedTicket.meta, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                      {/* admin actions: mark cancelled / resend email (optional) */}
                      <div className="mt-4 flex gap-2">
                        {/* Placeholder buttons - implement endpoints as needed */}
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/admin/bookings/${selectedTicket._id}/resend`); // implement server endpoint if desired
                              alert("Resend requested");
                            } catch (err) {
                              alert("Failed to resend");
                            }
                          }}
                          className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                          Resend Ticket
                        </button>

                        <button
                          onClick={async () => {
                            if (!window.confirm("Mark this ticket as cancelled?")) return;
                            try {
                              await api.post(`/admin/bookings/${selectedTicket._id}/cancel`); // implement server endpoint to set status
                              alert("Ticket cancelled");
                              fetchBookings();
                              setSelectedId(null);
                            } catch (err) {
                              alert("Failed to cancel");
                            }
                          }}
                          className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white text-sm"
                        >
                          Cancel Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// // admin/src/pages/Bookings.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import api from "../api"; // your configured axios instance
// import { X, Download } from "lucide-react"; 

// function formatDate(d) {
//   try {
//     return new Date(d).toLocaleString();
//   } catch {
//     return d;
//   }
// }

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState(""); 

//   const [page, setPage] = useState(1);
//   const pageSize = 12;

//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const fetchBookings = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/admin/bookings");
//       setBookings(Array.isArray(res.data) ? res.data : res.data.data ?? []);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || err.message || "Failed to load bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     if (!selectedId) {
//       setSelectedTicket(null);
//       return;
//     }
//     let cancelled = false;
//     (async () => {
//       setDetailLoading(true);
//       try {
//         const res = await api.get(`/admin/bookings/${selectedId}`);
//         if (!cancelled) setSelectedTicket(res.data);
//       } catch (err) {
//         console.error("detail fetch error", err);
//         if (!cancelled) setSelectedTicket(null);
//       } finally {
//         if (!cancelled) setDetailLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [selectedId]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return bookings.filter(b => {
//       if (statusFilter && String(b.status).toLowerCase() !== statusFilter.toLowerCase()) return false;
//       if (!q) return true;
//       return (
//         String(b.studentName ?? b.applicantName ?? "").toLowerCase().includes(q) ||
//         String(b.email ?? "").toLowerCase().includes(q) ||
//         String(b.phone ?? "").toLowerCase().includes(q) ||
//         String(b.ticketCode ?? "").toLowerCase().includes(q) ||
//         String(b.eventName ?? "").toLowerCase().includes(q) ||
//         String(b.rollNumber ?? "").toLowerCase().includes(q)
//       );
//     });
//   }, [bookings, query, statusFilter]);

//   const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
//   useEffect(() => {
//     if (page > pageCount) setPage(pageCount);
//   }, [pageCount]);

//   // --- EXPORT LOGIC (Now includes the new columns) ---
//   const handleExportCSV = () => {
//     if (filtered.length === 0) return alert("No data to export");

//     const headers = [
//       "Ticket Code", "Status", "Name", "Roll No", "Dept", "Section", "Event", "Email", "Phone", "Date"
//     ];

//     const rows = filtered.map(b => [
//       b.ticketCode || "-",
//       b.status || "",
//       b.studentName || b.applicantName || "",
//       b.rollNumber || "-",
//       b.department || "-",
//       b.section || "-",
//       b.eventName || (b.eventId?.name || b.eventId) || "",
//       b.email || "",
//       `'${b.phone || ""}`, // formatted for Excel
//       formatDate(b.createdAt)
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Bookings_Full_Export.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   function downloadPdf(base64OrDataUrl, filename = "ticket.pdf") {
//     if (!base64OrDataUrl) return;
//     let dataUrl = base64OrDataUrl;
//     if (!dataUrl.startsWith("data:")) {
//       dataUrl = `data:application/pdf;base64,${base64OrDataUrl}`;
//     }
//     const link = document.createElement("a");
//     link.href = dataUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   return (
//     <div className="p-4">
//       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
//         <h2 className="text-xl font-bold">Bookings Management</h2>
//         <div className="flex flex-wrap items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search details..."
//             value={query}
//             onChange={(e) => { setQuery(e.target.value); setPage(1); }}
//             className="px-3 py-2 rounded bg-gray-900 border border-red-800 text-white placeholder-gray-400"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//             className="px-3 py-2 rounded bg-gray-900 border border-red-800 text-white"
//           >
//             <option value="">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="paid">Paid</option>
//             <option value="sent">Sent</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//           <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold">
//             <Download size={16} /> Export CSV
//           </button>
//           <button onClick={() => fetchBookings()} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">
//             Refresh
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-12 text-gray-300">Loading bookings…</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-black/30 rounded border border-red-800">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead className="bg-black/60">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">#</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Roll No</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Dept/Sec</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Event</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ticket</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800">
//                 {filtered.slice((page - 1) * pageSize, page * pageSize).map((b, i) => (
//                   <tr key={b._id || b.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-4 py-3 text-sm text-gray-400">{(page - 1) * pageSize + i + 1}</td>
//                     <td className="px-4 py-3 text-sm text-gray-200">
//                         <div className="font-semibold">{b.studentName ?? b.applicantName}</div>
//                         <div className="text-xs text-gray-500">{b.email}</div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-300">{b.rollNumber || '-'}</td>
//                     <td className="px-4 py-3 text-sm text-gray-300">
//                         {b.department || '-'}{b.section ? ` / ${b.section}` : ''}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-300">{b.eventName ?? (b.eventId?.name || b.eventId)}</td>
//                     <td className="px-4 py-3 text-sm font-mono text-red-400">{b.ticketCode || '-'}</td>
//                     <td className="px-4 py-3 text-sm">
//                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.status === 'paid' ? 'bg-green-900 text-green-200' : b.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-gray-800 text-gray-300'}`}>
//                         {b.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <button onClick={() => setSelectedId(b._id || b.id)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">View</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex items-center justify-between mt-4">
//             <div className="text-xs text-gray-500">Total {filtered.length} bookings</div>
//             <div className="flex gap-1">
//               <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-30 text-white text-sm">Prev</button>
//               <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-30 text-white text-sm">Next</button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* MODAL (unchanged but ensured it works with data) */}
//       {selectedId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
//           <div className="bg-gray-950 rounded-lg max-w-2xl w-full border border-red-900 shadow-2xl">
//             <div className="flex items-center justify-between p-4 border-b border-red-900">
//               <h3 className="font-bold text-white">Ticket Details</h3>
//               <button onClick={() => setSelectedId(null)}><X className="text-white" /></button>
//             </div>
//             <div className="p-6">
//               {detailLoading || !selectedTicket ? <div className="text-center text-gray-500">Loading...</div> : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col items-center justify-center bg-white p-4 rounded">
//                         {selectedTicket.qrDataUrl ? <img src={selectedTicket.qrDataUrl} className="w-40 h-40" alt="QR"/> : <div className="text-gray-400">No QR</div>}
//                         <div className="mt-2 text-black font-mono font-bold">{selectedTicket.ticketCode}</div>
//                     </div>
//                     <div className="space-y-2 text-sm text-gray-300">
//                         <p><span className="text-gray-500">Name:</span> {selectedTicket.studentName}</p>
//                         <p><span className="text-gray-500">Roll No:</span> {selectedTicket.rollNumber}</p>
//                         <p><span className="text-gray-500">Dept:</span> {selectedTicket.department}</p>
//                         <p><span className="text-gray-500">Section:</span> {selectedTicket.section}</p>
//                         <p><span className="text-gray-500">Phone:</span> {selectedTicket.phone}</p>
//                         <p><span className="text-gray-500">Email:</span> {selectedTicket.email}</p>
//                         <div className="pt-4 flex gap-2">
//                              {selectedTicket.pdfTicketBase64 && (
//                                 <button onClick={() => downloadPdf(selectedTicket.pdfTicketBase64)} className="bg-red-600 px-3 py-1.5 rounded text-white text-xs font-bold">PDF</button>
//                              )}
//                              <button onClick={() => setSelectedId(null)} className="bg-gray-800 px-3 py-1.5 rounded text-white text-xs font-bold">Close</button>
//                         </div>
//                     </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }