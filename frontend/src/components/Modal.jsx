// src/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({ open, onClose, children, maxWidth = "max-w-3xl" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative z-10 w-full mx-4 ${maxWidth}`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-auto max-h-[85vh]">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-600 dark:text-gray-200 text-xl"
          >
            ✕
          </button>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
