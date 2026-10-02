// components/home/PunditsStrip.tsx

import Image from "next/image";

const PUNDITS = [
  {
    id: 1,
    name: "Muyiwa-Joshua AGBOOLA",
    title: "Muyiwa-Joshua AGBOOLA Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "/Muyiwa-Joshua.jpg",
  },
  {
    id: 2,
    name: "Tunmise A.",
    title: "Tunmise A. Says: Manchester united will winn the league",
    img: "/Dios-ayudame.jpg",
  },
  {
    id: 3,
    name: "Olusola Victor",
    title: "Olusola Victor Says: Arsenal will choke again before the season ends",
    img: "/Olusola-Victor.jpeg",
  },
  {
    id: 4,
    name: "Toheeb Adesola",
    title: "Toheeb Adesola Says: Messi is still better than Ronaldo, no debate",
    img: "/Toheeb-Adesola.jpeg",
  },
  // {
  //   id: 5,
  //   name: "MJAY-OFFICIAL",
  //   title: "MjAY Says: Ronaldo remains the GOAT despite World-Cup lose",
  //   img: "/pundits/mjay-official.jpg",
  // },
];
export default function PunditsStrip() {
  return (
    <section className="bg-[#f3f3f3] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1234px] px-4 sm:px-6">
        {/* Heading aligned with first card */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[58px] font-black leading-none text-black">
            PUNDITS
          </h2>

          <p className="mt-1 text-sm sm:text-base lg:text-[22px] font-semibold text-[#666666]">
            Click for more updates
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {PUNDITS.map((p) => (
            <article
              key={p.id}
              className="bg-white px-5 pt-8 pb-8 shadow-[0_25px_60px_rgba(0,0,0,0.12)] sm:px-8 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-14"
            >
              <div className="relative mx-auto mb-4 h-[160px] w-[160px] overflow-hidden rounded-tr-[24px] rounded-bl-[24px] sm:mb-5 sm:h-[200px] sm:w-[200px] lg:h-[250px] lg:w-[250px] lg:rounded-tr-[32px] lg:rounded-bl-[32px]">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 200px, 160px"
                  className="object-cover"
                />
              </div>

              <p className="mb-1.5 text-center text-sm font-extrabold uppercase text-[#A855F7] sm:mb-2 sm:text-base lg:text-[18px]">
                {p.name}
              </p>

              <h3 className="text-center text-base font-black leading-tight text-[#625C5C] sm:text-lg lg:text-[24px]">
                {p.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}