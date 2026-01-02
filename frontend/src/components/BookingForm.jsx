import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

/* Razorpay loader */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

export default function BookingForm() {
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
    section: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ ok: null, message: "" });
  const [orderInfo, setOrderInfo] = useState(null);

  /* ================= LOAD EVENT ================= */
  useEffect(() => {
    let mounted = true;
    const loadEvent = async () => {
      try {
        const res = await api.get(`/events/${encodeURIComponent(slug)}`);
        const data = res?.data?.data || res.data;
        if (mounted) setEvent(data);
      } catch {
        if (mounted) setEvent(null);
      } finally {
        if (mounted) setLoadingEvent(false);
      }
    };
    loadEvent();
    return () => (mounted = false);
  }, [slug]);

  /* ================= FORM HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "tickets" ? Math.max(1, Number(value)) : value,
    }));
  };

  /* ================= RAZORPAY ================= */
  async function startCheckout(order) {
    await loadRazorpayScript();

    const options = {
      key: order.razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: event.name,
      description: `Ticket for ${event.name}`,
      order_id: order.orderId,

      handler: async (response) => {
        try {
          await api.post("/book/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            ticketId: order.ticketId,
          });

          setResult({
            ok: true,
            message: "Payment successful! Ticket booked.",
          });
        } catch {
          setResult({
            ok: false,
            message: "Payment verification failed.",
          });
        } finally {
          setSubmitting(false);
        }
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
    };

    new window.Razorpay(options).open();
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.rollNumber ||
      !form.year ||
      !form.department ||
      !form.section
    ) {
      setResult({
        ok: false,
        message: "Please fill all required student details.",
      });
      return;
    }

    setSubmitting(true);
    setResult({ ok: null, message: "" });

    try {
      const payload = {
        eventId: event._id,
        studentName: form.name,
        email: form.email,
        phone: form.phone,
        rollNumber: form.rollNumber,
        year: form.year,
        department: form.department,
        section: form.section,
      };

      const res = await api.post("/book", payload);
      const data = res.data;

      // FREE EVENT
      if (!data.orderId) {
        setResult({
          ok: true,
          message: "Ticket booked successfully!",
        });
        setSubmitting(false);
        return;
      }

      setOrderInfo(data);
      await startCheckout(data);
    } catch (err) {
      setResult({
        ok: false,
        message: "Booking failed. Please try again.",
      });
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center text-red-500 mb-8">
          Book Your Seat
        </h1>

        {loadingEvent ? (
          <Card>Loading event...</Card>
        ) : !event ? (
          <Card className="bg-red-900/40 border-red-600">
            Event not found <Link to="/events" className="underline ml-2">Back</Link>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {event.date ? new Date(event.date).toLocaleString() : "Date TBA"}
              </p>
              <p className="text-gray-300 mt-3">{event.description}</p>
            </Card>

            {result.ok && (
              <Card className="bg-green-900/40 border-green-600 mb-6">
                {result.message}
              </Card>
            )}

            {result.ok === false && (
              <Card className="bg-red-900/40 border-red-600 mb-6">
                {result.message}
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Section title="Personal Information">
                <Input label="Full Name" name="name" required value={form.name} onChange={handleChange} />
                <Input label="Email" type="email" name="email" required value={form.email} onChange={handleChange} />
                <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              </Section>

              <Section title="Student Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Roll Number" name="rollNumber" required value={form.rollNumber} onChange={handleChange} />
                  <Input label="Year" name="year" required value={form.year} onChange={handleChange} />
                  <Input label="Department" name="department" required value={form.department} onChange={handleChange} />
                  <Input label="Section" name="section" required value={form.section} onChange={handleChange} />
                </div>
              </Section>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl text-lg font-semibold bg-red-600 hover:bg-red-500 transition disabled:bg-gray-700"
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Card({ children, className = "" }) {
  return (
    <div className={`bg-neutral-900/80 border border-neutral-700 rounded-2xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-red-400">{title}</h3>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Input({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="w-full h-12 px-4 bg-black border border-neutral-700 rounded-xl focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
