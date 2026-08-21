// components/layout/Footer.tsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5]">
      {/* Divider */}
      <div className="mx-auto max-w-[1350px] border-t border-[#D9D9D9]" />

      {/* Main Footer */}
      <div className="mx-auto max-w-[1230px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h3 className="mb-8 text-[20px] font-extrabold uppercase text-black">
              FOOTBALL GAZETTE
            </h3>

            <ul className="space-y-5 text-[18px] text-black">
              <li>FG Main Events</li>
              <li>FG Football</li>
              <li>FG Sport News</li>
              <li>FG Pundits</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="mb-8 text-[20px] font-extrabold uppercase text-black">
              PARTNERS
            </h3>

            <ul className="space-y-5 text-[18px] text-black">
              <li>Skysport</li>
              <li>SportyBet</li>
              <li>Kings Bet</li>
              <li>Sobi FM</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="mb-8 text-[20px] font-extrabold uppercase text-black">
              MORE
            </h3>

            <ul className="space-y-5 text-[18px] text-black">
              <li>FG TV</li>
              <li>FG News</li>
              <li>Store Locators</li>
              <li>FG Communal TV</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <p className="mb-2 text-[18px] text-black">
              News-letters
            </p>

            <div className="mb-4 h-[56px] w-full bg-gradient-to-r from-[#B13CFF] to-[#9147F0] px-5 flex items-center">
              <span className="text-[18px] italic text-white">
                Email
              </span>
            </div>

            <div className="space-y-1 text-[18px] leading-tight text-[#666]">
              <p>Copywrite FOOTBALL GAZETTE</p>
              <p>(234)878 55 ---</p>
              <p>Contact FG</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Bottom Bar */}
      <div className="bg-[#6D1FB9]">
        <div className="mx-auto flex h-[82px] max-w-[1230px] items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo-white.png"
              alt="Football Gazette"
              width={70}
              height={70}
            />

            <div className="text-white">
              <div className="text-[24px] font-black leading-none">
                FOOTBALL
              </div>
              <div className="text-[24px] font-black leading-none">
                GAZETTE
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-12 text-[16px] font-bold uppercase text-white">
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