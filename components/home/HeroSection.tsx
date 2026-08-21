"use client";
import Image from "next/image";
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

  const handleNext = () => setOffset((prev) => (prev + 1) % total);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setOffset((prev) => (prev + 1) % total), 5000);
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
    // shorter, fixed-ratio height on mobile instead of full h-screen
    <section className="relative w-full h-[70vh] min-h-[420px] sm:h-screen sm:min-h-[560px] max-h-[900px] overflow-hidden">
      <Image
        key={current.id}
        src={current.image}
        alt={current.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:object-top transition-opacity duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-purple-800/70" />

      <div className="absolute top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

          <div className="flex-1 max-w-2xl pb-2">
            <p className="text-purple-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] mb-2 sm:mb-3">
              {current.category}
            </p>
            <h1 className="text-white font-extrabold text-[1.6rem] leading-[1.2] sm:text-[2rem] md:text-[2.6rem] sm:leading-[1.1] mb-5 sm:mb-7 max-w-[560px]">
              {current.title}
            </h1>
            {current.url ? (
              
               <a  href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[12px] sm:text-[13px] font-bold px-5 sm:px-7 py-2.5 sm:py-3 rounded-none transition-colors duration-200 tracking-wide"
              >
                View now
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ) : (
              <button className="group inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[12px] sm:text-[13px] font-bold px-5 sm:px-7 py-2.5 sm:py-3 rounded-none transition-colors duration-200 tracking-wide">
                View now
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

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
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="210px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {total > 1 && (
            <div className="flex lg:hidden items-center gap-3 w-full">
              <span className="text-white text-[12px] font-bold tracking-[0.15em] shrink-0">
                0{currentSlide}–0{total}
              </span>
              <div className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${(currentSlide / total) * 100}%` }}
                />
              </div>
              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="shrink-0 text-white p-1.5 border border-white/40 rounded-full hover:border-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}