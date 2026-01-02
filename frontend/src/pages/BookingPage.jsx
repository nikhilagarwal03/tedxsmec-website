import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { api } from "../api";
import BookingForm from "../components/BookingForm";

// ─── VENUE RESOLVER (FIX) ────────────────────────────────────
const resolveVenue = (e) =>
  e?.venue ||
  e?.venueName ||
  e?.location ||
  e?.place ||
  e?.address ||
  e?.venue?.name ||
  "Venue TBA";

// ─── DUMMY DATA (Fallback) ───────────────────────────────────
const DUMMY_EVENTS = [
  {
    _id: "evt-1",
    slug: "echoes-of-innovation",
    name: "Echoes of Innovation",
    date: new Date(Date.now() + 864000000).toISOString(),
    venue: "Grand Auditorium",
    priceInt: 0,
    price: "Free",
  },
  {
    _id: "evt-2",
    slug: "sustainable-horizons",
    name: "Sustainable Horizons",
    date: new Date(Date.now() + 1728000000).toISOString(),
    venue: "Green Park Center",
    priceInt: 499,
    price: "₹499",
  },
];

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${slug}`);
        const data = res.data?.success ? res.data.data : res.data;
        if (data) setEvent(data);
        else throw new Error("No data");
      } catch (err) {
        console.warn("Booking Page: API failed, checking fallback.", err);
        const found = DUMMY_EVENTS.find(
          (e) => e.slug === slug || e._id === slug
        );
        if (found) setEvent(found);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-600 font-bold tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <Link to="/events" className="text-red-500 hover:underline">
          Return to Calendar
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Back Link */}
        <Link
          to={`/events/${slug}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Event Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Complete Your <br />
                <span className="text-red-600">Registration</span>
              </h1>
              <p className="text-xl text-gray-400">
                You are booking a seat for{" "}
                <strong>{event.name}</strong>. Please fill out the details
                carefully.
              </p>
            </div>

            {/* Event Summary */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
                Event Summary
              </h3>

              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <Calendar className="text-red-600" size={20} />
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-red-600" size={20} />
                  <span>{resolveVenue(event)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500 uppercase">
                    Ticket Price
                  </span>
                  <span className="text-xl font-bold text-white">
                    {event.price || "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <BookingForm event={event} />
          </div>

        </div>
      </div>
    </div>
  );
}
