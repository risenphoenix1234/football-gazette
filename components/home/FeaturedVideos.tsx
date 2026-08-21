// components/home/FeaturedVideos.tsx
import Image from "next/image";
import { getFootballVideos } from "@/lib/youtube";

export default async function FeaturedVideos() {
  const videos = await getFootballVideos(10).catch(() => []);

  if (videos.length === 0) {
    return (
      <section className="relative w-full bg-[#1a1a2e] py-20 text-center text-white/60">
        No videos available right now.
      </section>
    );
  }

  return (
    <section id="features" className="relative w-full bg-[#1a1a2e] py-16">
      <div className="mx-auto max-w-[1300px] px-4 lg:px-8">
        <h2 className="text-white font-black text-[1.8rem] md:text-[2.2rem] uppercase leading-tight tracking-tight">
          Featured Videos
        </h2>
        <p className="mt-1 text-white/50 text-sm">
          Fresh highlights, updated hourly
        </p>

        <div className="mt-10 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 min-w-max">
            {videos.map((video) => (
              
               <a  key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-xl bg-[#1a1020] shadow-lg transition-transform hover:-translate-y-1"
              >
                {/* Thumbnail — fixed aspect ratio, always fills fully */}
                <div className="relative aspect-video w-full flex-shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Play button overlay, centered on thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/80">
                      <svg className="ml-0.5 h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between px-5 py-5">
                  <h3 className="text-[15px] font-bold leading-snug text-white line-clamp-3">
                    {video.title}
                  </h3>
                  <p className="mt-4 truncate text-[13px] font-semibold text-purple-300">
                    {video.channel}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}