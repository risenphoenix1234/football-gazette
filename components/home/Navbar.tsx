"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "Latest News", id: "latest-news" },
  { label: "Contact Us", id: "/contact-us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // If we land on the homepage with a hash (e.g. after being redirected
  // from another page), scroll to that section once it's mounted.
  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);

    // Real page routes (e.g. "/contact-us") — let Next navigate normally,
    // no scroll logic needed.
    if (id.startsWith("/")) {
      setActive(id);
      return;
    }

    // Not on the homepage — let the link navigate normally to /#id,
    // the effect above will scroll once we land there.
    if (pathname !== "/") {
      setActive(id);
      return;
    }

    // Already on the homepage — just smooth-scroll, no page reload.
    e.preventDefault();
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getHref = (id: string) => (id.startsWith("/") ? id : `/#${id}`);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? "bg-purple-800" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-5">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Football Gazette Logo"
            width={52}
            height={52}
            className="shrink-0"
          />

          <div className="leading-[1.1]">
            <p className="text-white font-black text-[13px] tracking-[0.2em] uppercase">
              Football
            </p>
            <p className="text-white font-black text-[13px] tracking-[0.2em] uppercase">
              Gazette
            </p>
          </div>
        </Link>

        {/* NAV LINKS (desktop) */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              <a
                href={getHref(id)}
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

          <li>
            <Link
              href="/Fantasy-premier-league"
              className="text-white/80 text-[13px] font-semibold tracking-widest uppercase hover:text-white transition-colors"
            >
              Fantasy Premier League
            </Link>
          </li>
        </ul>

        {/* ACTIONS (desktop) */}
        <div className="hidden md:flex items-center gap-4 text-white">
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

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-3 text-white">
          <button className="hover:opacity-75 transition-opacity" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="relative w-6 h-6 flex flex-col justify-center items-center gap-[5px]"
          >
            <span
              className={`block w-6 h-[2px] bg-white transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-purple-800 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-4 pb-4 pt-2 gap-1">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              <a
                href={getHref(id)}
                onClick={(e) => handleNavClick(e, id)}
                className={`block py-3 text-[13px] font-bold tracking-widest uppercase border-b border-white/10 ${
                  active === id ? "text-white" : "text-white/80"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/Fantasy-premier-league"
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-[13px] font-semibold tracking-widest uppercase text-white/80 border-b border-white/10"
            >
              Fantasy Premier League
            </Link>
          </li>
          <li className="pt-3">
            <button className="flex items-center gap-1 text-[13px] font-bold tracking-wider text-white">
              EN
              <svg className="w-3 h-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}