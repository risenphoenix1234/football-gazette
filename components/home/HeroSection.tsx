// src/components/HeroSection.tsx
"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import type { NewsArticle } from "@/lib/news";

const FALLBACK_SLIDE: NewsArticle = {
  id: "fallback",
  category: "FIRST TEAM",
  title: "Transfer Update: Juventus drops hint over Cristiano Ronaldo future",
  author: "Football Gazette",
  source: "Football Gazette",
  image: "/cr7.png",
  avatar: null,
  description: "",
  content: "",
  url: "",
  publishedAt: new Date().toISOString(),
};

export default function HeroSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setArticles((data.articles ?? []).slice(0, 6)))
      .catch(() => setArticles([]));
  }, []);

  const slides = articles.length > 0 ? articles : [FALLBACK_SLIDE];
  const total = slides.length;

  const handleNext = () => {
    setOffset((prev) => (prev + 1) % total);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (total <= 1) return;

    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(id);
  }, [total]);

  const visibleSlides = [
    slides[offset % total],
    slides[(offset + 1) % total],
    slides[(offset + 2) % total],
  ].filter((_, i) => i < Math.min(total, 3));

  const current = slides[offset % total];
  const currentSlide = offset + 1;

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[900px] overflow-hidden">
      <img
        src={current.image}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-purple-800/70" />

      {/* NAVBAR */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* HERO CONTENT */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="mx-auto max-w-7xl w-full px-8 pb-10 flex items-end justify-between gap-6">

          {/* LEFT */}
          <div className="flex-1 max-w-2xl pb-2">
            <p className="text-purple-300 text-[11px] font-bold uppercase tracking-[0.35em] mb-3">
              {current.category}
            </p>
            <h1 className="text-white font-extrabold text-[2.6rem] leading-[1.1] mb-7 max-w-[560px]">
              {current.title}
            </h1>
            {current.url ? (
              
               <a href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[13px] font-bold px-7 py-3 rounded-none transition-colors duration-200 tracking-wide"
              >
                View now
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ) : (
              <button className="group inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[13px] font-bold px-7 py-3 rounded-none transition-colors duration-200 tracking-wide">
                View now
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* RIGHT */}
          {total > 1 && (
            <div className="hidden lg:flex items-end gap-4 shrink-0">
              <div className="flex items-center gap-3 pb-1">
                <span className="text-white text-[13px] font-bold tracking-[0.18em]">
                  0{currentSlide}–0{total}
                </span>
                <div className="w-20 h-[2px] bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${(currentSlide / total) * 100}%` }}
                  />
                </div>
                <button
                  onClick={handleNext}
                  className="text-white text-[13px] font-bold tracking-[0.18em] hover:text-purple-300 transition-colors"
                >
                  NEXT
                </button>
              </div>

              <div className="flex items-end gap-2 overflow-hidden">
                {visibleSlides.map((slide, i) => (
                  <div
                    key={`${offset}-${i}`}
                    className={`relative rounded-sm overflow-hidden shrink-0 transition-all duration-500 ${
                      i === 0 ? "ring-1 ring-white/30" : "ring-1 ring-white/20 opacity-90"
                    }`}
                    style={{ width: i === 0 ? "210px" : "170px", height: "155px" }}
                  >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}