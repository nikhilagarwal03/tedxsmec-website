// frontend/src/pages/BookingCheckout.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

/* Load Razorpay Script */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  });
}

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export default function BookingCheckout() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    note: "",
    rollNumber: "",
    year: "",
    department: "",
    section: ""
  });

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  /* Load Event */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get(`/events/${encodeURIComponent(slug)}`);
        const eventData = res?.data?.data || res.data;
        if (mounted) setEvent(eventData);
      } catch (err) {
        console.error("Event load error", err);
        if (mounted) setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [slug]);

  /* Form change handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const totalAmount = (event?.price || 0) * (form.tickets || 1);

  /* Razorpay Checkout */
  async function startCheckout(orderId, razorpayKey, ticketId) {
    await loadRazorpayScript();

    const options = {
      key: razorpayKey,
      amount: orderInfo.amount,
      currency: orderInfo.currency,
      name: event?.name,
      description: `Ticket for ${event?.name}`,
      order_id: orderId,

      handler: async function (response) {
        try {
          setMessage({ type: "info", text: "Verifying payment..." });

          const verifyRes = await api.post("/book/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            ticketId
          });

          const ticketObj = verifyRes?.data?.data || verifyRes.data;
          setTicket(ticketObj);

          setMessage({ type: "success", text: "Payment verified successfully!" });
        } catch (err) {
          console.error("Verify error", err);
          setMessage({ type: "error", text: "Payment verification failed." });
        } finally {
          setBusy(false);
        }
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /* Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setTicket(null);

    try {
      const payload = {
        eventId: event?._id,
        studentName: form.name,
        email: form.email,
        phone: form.phone,
        rollNumber: form.rollNumber,
        year: form.year,
        department: form.department,
        section: form.section
      };

      const res = await api.post("/book", payload); // ✔ correct path
      const data = res.data;

      setOrderInfo(data);

      // Free event
      if (!data.orderId) {
        setMessage({ type: "success", text: "Ticket booked successfully!" });
        setTicket(data.ticket);
        setBusy(false);
        return;
      }

      await startCheckout(data.orderId, data.razorpayKey, data.ticketId);
    } catch (err) {
      console.error("Submit error", err);
      setMessage({ type: "error", text: "Booking failed." });
      setBusy(false);
    }
  };

  /* Download PDF */
  function downloadPdf(base64, filename) {
    if (!base64) return;
    const link = document.createElement("a");
    link.href = base64.startsWith("data:") ? base64 : `data:application/pdf;base64,${base64}`;
    link.download = filename;
    link.click();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Book Tickets <span className="text-red-500">TEDx</span>
      </h1>

      {/* EVENT CARD */}
      {loadingEvent ? (
        <div className="p-4 bg-gray-800 rounded">Loading event...</div>
      ) : !event ? (
        <div className="p-4 bg-red-700 rounded">Event not found.</div>
      ) : (
        <>
          <div className="p-5 bg-black rounded border border-red-700 mb-5">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-400 mt-1">
              {event.date ? new Date(event.date).toLocaleString() : "Date TBA"}
            </p>
            <p className="text-gray-400 mt-3">{event.description}</p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`p-3 rounded mb-4 ${
                message.type === "error"
                  ? "bg-red-700"
                  : message.type === "success"
                  ? "bg-green-700"
                  : "bg-yellow-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* FORM OR TICKET */}
          {!ticket ? (
            <form onSubmit={handleSubmit} className="bg-black border border-red-700 p-5 rounded space-y-4">
              
              {/* NAME / EMAIL / PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="name" required placeholder="Full Name"
                  value={form.name} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="email" required type="email" placeholder="Email"
                  value={form.email} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="phone" placeholder="Phone"
                  value={form.phone} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />
              </div>

              {/* ACADEMIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input name="rollNumber" placeholder="Roll No"
                  value={form.rollNumber} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <select name="year" value={form.year} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded">
                  <option value="">Year</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>

                <input name="department" placeholder="Department"
                  value={form.department} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="section" placeholder="Section"
                  value={form.section} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />
              </div>

              {/* TICKETS */}
              <div>
                <label className="text-sm text-gray-300">Tickets</label>
                <input name="tickets" type="number" min="1"
                  value={form.tickets} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded w-full mt-1" />
              </div>

              {/* BUTTON */}
              <button disabled={busy}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold">
                {busy ? "Processing..." : `Pay & Book • ${formatINR(totalAmount)}`}
              </button>

            </form>
          ) : (
            /* TICKET DISPLAY */
            <div className="bg-gray-900 p-6 rounded border border-red-700">
              <h2 className="font-bold text-lg mb-4">Your Ticket</h2>
              <img
                src={ticket.qrDataUrl}
                alt="Ticket QR"
                className="w-48 h-48 bg-white p-2 rounded"
              />

              <p className="mt-4"><strong>Code:</strong> {ticket.ticketCode}</p>
              <p><strong>Name:</strong> {ticket.studentName}</p>
              <p><strong>Event:</strong> {event.name}</p>

              <button
                onClick={() => downloadPdf(ticket.pdfTicketBase64, `ticket-${ticket.ticketCode}.pdf`)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
              >
                Download PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
