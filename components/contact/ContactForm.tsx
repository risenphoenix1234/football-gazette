// components/contact/ContactForm.tsx

"use client";

import { useState } from "react";

export default function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = (() => {
    const subject = encodeURIComponent(`Message from ${name || "the website"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name || "Anonymous"}${email ? ` (${email})` : ""}`
    );
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  })();

  return (
    <div className="bg-[#f5f5f5] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-purple-600 sm:px-4 sm:py-3 sm:text-base"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-purple-600 sm:px-4 sm:py-3 sm:text-base"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="What's on your mind?"
            className="w-full resize-none border border-gray-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-purple-600 sm:px-4 sm:py-3 sm:text-base"
          />
        </div>

        
          <a href={mailtoHref}
          className="inline-block w-full bg-purple-700 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-purple-800 sm:text-base"
        >
          Send Message
        </a>
        <p className="text-xs text-gray-400 sm:text-sm">
          This opens your email app with the message pre-filled — we don&apos;t
          have a backend inbox hooked up yet.
        </p>
      </div>
    </div>
  );
}