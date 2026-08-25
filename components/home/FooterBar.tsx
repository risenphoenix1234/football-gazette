// components/layout/Footer.tsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5]">
      {/* Divider */}
      <div className="mx-auto max-w-[1350px] border-t border-[#D9D9D9]" />

      {/* Main Footer */}
      <div className="mx-auto max-w-[1230px] px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h3 className="mb-6 text-[18px] font-extrabold uppercase text-black sm:mb-8 sm:text-[20px]">
              FOOTBALL GAZETTE
            </h3>

            <ul className="space-y-3 text-[16px] text-black sm:space-y-5 sm:text-[18px]">
              <li>FG Main Events</li>
              <li>FG Football</li>
              <li>FG Sport News</li>
              <li>FG Pundits</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-6 text-[18px] font-extrabold uppercase text-black sm:mb-8 sm:text-[20px]">
              PARTNERS
            </h3>

            <ul className="space-y-3 text-[16px] text-black sm:space-y-5 sm:text-[18px]">
              <li>Skysport</li>
              <li>SportyBet</li>
              <li>Kings Bet</li>
              <li>Sobi FM</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="mb-6 text-[18px] font-extrabold uppercase text-black sm:mb-8 sm:text-[20px]">
              MORE
            </h3>

            <ul className="space-y-3 text-[16px] text-black sm:space-y-5 sm:text-[18px]">
              <li>FG TV</li>
              <li>FG News</li>
              <li>Store Locators</li>
              <li>FG Communal TV</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <p className="mb-2 text-[16px] text-black sm:text-[18px]">
              News-letters
            </p>

            <div className="mb-4 flex h-[50px] w-full items-center bg-gradient-to-r from-[#B13CFF] to-[#9147F0] px-5 sm:h-[56px]">
              <span className="text-[16px] italic text-white sm:text-[18px]">
                Email
              </span>
            </div>

            <div className="space-y-1 text-[16px] leading-tight text-[#666] sm:text-[18px]">
              <p>Copywrite FOOTBALL GAZETTE</p>
              <p>(234)878 55 ---</p>
              <p>Contact FG</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Bottom Bar */}
      <div className="bg-[#6D1FB9]">
        <div className="mx-auto flex max-w-[1230px] flex-col items-center gap-4 px-4 py-6 sm:h-[82px] sm:flex-row sm:justify-between sm:px-6 sm:py-0">
          {/* Logo */}
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

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] font-bold uppercase text-white sm:gap-8 sm:text-[16px] lg:gap-12">
            <Link href="#">Accessibility</Link>
            <Link href="#">Disclaimer</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}