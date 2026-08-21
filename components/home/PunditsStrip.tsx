// components/home/PunditsStrip.tsx

import Image from "next/image";

const PUNDITS = [
  {
    id: 1,
    name: "MC-COZAR",
    title:
      "MC-COZAR Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "NICANO-LISS",
    title:
      "MC-COZAR Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "MJAY-OFFICIAL",
    title:
      "MjAY Says: Ronaldo remains the GOAT despite World-Cup lose",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
];

export default function PunditsStrip() {
  return (
    <section className="bg-[#f3f3f3] py-24">
      <div className="mx-auto max-w-[1234px] px-4">
        {/* Heading aligned with first card */}
        <div className="mb-10">
          <h2 className="text-[58px] font-black leading-none text-black">
            PUNDITS
          </h2>

          <p className="mt-1 text-[22px] font-semibold text-[#666666]">
            Click for more updates
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {PUNDITS.map((p) => (
            <article
              key={p.id}
              className="bg-white px-8 pt-16 pb-14 shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="mx-auto mb-5 h-[250px] w-[250px] overflow-hidden rounded-tr-[32px] rounded-bl-[32px]">
                <Image
                  src={p.img}
                  alt={p.name}
                  width={250}
                  height={250}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mb-2 text-center text-[18px] font-extrabold uppercase text-[#A855F7]">
                {p.name}
              </p>

              <h3 className="text-center text-[24px] font-black leading-tight text-[#625C5C]">
                {p.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}