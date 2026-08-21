"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/news", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setError("Failed to create news");
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
  };

  return (
    <section className="max-w-3xl">
      <h1 className="mb-4 text-xl font-semibold text-white">Create News</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Title</label>
          <input
            name="title"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Excerpt</label>
          <input
            name="excerpt"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Content</label>
          <textarea
            name="content"
            rows={8}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            className="block w-full text-sm text-slate-300"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          {loading ? "Saving..." : "Publish"}
        </button>
      </form>
    </section>
  );
}
