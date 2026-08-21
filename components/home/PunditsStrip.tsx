// components/home/PunditsStrip.tsx

import Image from "next/image";

const PUNDITS = [
  {
    id: 1,
    name: "MC-COZAR",
    title: "MC-COZAR Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "NICANO-LISS",
    title: "MC-COZAR Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "MJAY-OFFICIAL",
    title: "MjAY Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
  },
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
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
          {PUNDITS.map((p) => (
            <article
              key={p.id}
              className="bg-white px-5 pt-8 pb-8 sm:px-8 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-14 shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="mx-auto mb-4 sm:mb-5 h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] lg:h-[250px] lg:w-[250px] overflow-hidden rounded-tr-[24px] rounded-bl-[24px] lg:rounded-tr-[32px] lg:rounded-bl-[32px]">
                <Image
                  src={p.img}
                  alt={p.name}
                  width={250}
                  height={250}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mb-1.5 sm:mb-2 text-center text-sm sm:text-base lg:text-[18px] font-extrabold uppercase text-[#A855F7]">
                {p.name}
              </p>

              <h3 className="text-center text-base sm:text-lg lg:text-[24px] font-black leading-tight text-[#625C5C]">
                {p.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}