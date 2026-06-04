"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
          "your-name": String(formData.get("your-name") || ""),
          "your-email": String(formData.get("your-email") || ""),
          "your-subject": String(formData.get("your-subject") || ""),
          "your-message": String(formData.get("your-message") || ""),
        };

        try {
          const res = await fetch("/api/contact-submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (!res.ok || !data?.ok) {
            setMessage({
              type: "error",
              text: `Failed to submit. Status: ${data?.status || "unknown"}. Please try again.`,
            });
            return;
          }

          setMessage({
            type: "success",
            text: "Message sent successfully! We'll get back to you soon.",
          });
          form.reset();
        } catch (error) {
          setMessage({
            type: "error",
            text: "Network error. Please check your connection and try again.",
          });
        } finally {
          setLoading(false);
        }
      }}
    >
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <input
        name="your-name"
        type="text"
        placeholder="Your Name"
        autoComplete="name"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        name="your-email"
        type="email"
        placeholder="Your Email"
        autoComplete="email"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        name="your-subject"
        type="text"
        placeholder="Subject"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <textarea
        name="your-message"
        placeholder="Your Message"
        rows={5}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
