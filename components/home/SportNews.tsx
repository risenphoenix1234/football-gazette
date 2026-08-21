"use client";

import Image from "next/image";
 
import { useEffect, useRef, useState } from "react";
import type { NewsArticle } from "@/lib/news";

export default function SportNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data.articles ?? []))
      .finally(() => setLoading(false));
  }, []);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1300px] px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-black">SPORT NEWS</h2>
        <p className="mt-1 text-lg font-medium text-gray-500">Click for more updates</p>

        {loading && (
          <p className="mt-12 text-gray-400">Loading latest news…</p>
        )}

        {!loading && news.length === 0 && (
          <p className="mt-12 text-gray-400">No news available right now.</p>
        )}

        <div className="relative mt-12">
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max">
              {news.map((item, index) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                  <article className="relative h-[460px] w-[320px] flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className={`absolute inset-0 ${index === 0 ? "bg-purple-700/55" : "bg-black/55"}`} />

                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <span className="mb-4 text-lg font-semibold uppercase text-purple-400">
                        {item.category}
                      </span>
                      <h3 className="text-[20px] md:text-[22px] font-bold leading-tight">
                        {item.title}
                      </h3>

                      <div className="mt-8 flex items-center gap-3">
                        {item.avatar ? (
                          <div className="relative h-14 w-14 flex-shrink-0 aspect-square overflow-hidden rounded-full border-2 border-white">
                            <Image
                              src={item.avatar}
                              alt={item.author}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 flex-shrink-0 aspect-square items-center justify-center rounded-full border-2 border-white bg-purple-600 text-lg font-bold">
                            {item.source.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-bold">{item.author}</p>
                          <p className="truncate text-sm text-white/80">{item.source}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>

          {news.length > 0 && (
           <button
  onClick={scrollRight}
  aria-label="Scroll right"
  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition hover:bg-purple-700"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
</button>
          )}
        </div>

        <div className="h-full w-1/3 rounded-full bg-purple-600" />
      </div>
    </section>
  );
}