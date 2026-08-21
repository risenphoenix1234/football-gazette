"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  
  { label: "Features", id: "features" },
  { label: "Latest News", id: "latest-news" },
  { label: "Contact Us", id: "contact-us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-purple-800" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-8 flex items-center justify-between py-5">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Football Gazette Logo"
            width={52}
            height={52}
            className="shrink-0"
          />
          <div className="leading-[1.1]">
            <p className="text-white font-black text-[13px] tracking-[0.2em] uppercase">Football</p>
            <p className="text-white font-black text-[13px] tracking-[0.2em] uppercase">Gazette</p>
          </div>
        </div>

        {/* NAV LINKS */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              
               <a href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className={`text-[13px] font-bold tracking-widest uppercase pb-0.5 transition-colors ${
                  active === id
                    ? "text-white border-b-2 border-white"
                    : "text-white/80 font-semibold hover:text-white"
                }`}
              >
                {label}
              </a>
            </li>
          ))}

          {/* FPL — real route navigation, not a scroll link */}
          <li>
            <Link
              href="/Fantasy-premier-league"
              className="text-white/80 text-[13px] font-semibold tracking-widest uppercase hover:text-white transition-colors"
            >
              Fantasy Premier League
            </Link>
          </li>
        </ul>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 text-white">
          <button className="flex items-center gap-1 text-[13px] font-bold tracking-wider">
            EN
            <svg className="w-3 h-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="w-px h-5 bg-white/30" />
          <button className="hover:opacity-75 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}