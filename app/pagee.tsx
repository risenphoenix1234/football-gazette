// app/page.tsx
import HeroSection from "@/components/home/HeroSection";
// import other sections when you create them

export default function HomePage() {
  return (
    // ✅
<main className="relative min-h-screen bg-slate-950 text-white">
      <HeroSection />
      <section className="bg-white text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-4 text-xs font-semibold tracking-[0.25em] text-slate-500">
            MATCH SCHEDULE
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {/* placeholder cards; later replace with real fixtures */}
            <div className="rounded-lg bg-slate-900 text-white p-4">
              <p className="text-xs text-slate-400">Premier League</p>
              <p className="mt-1 text-sm font-semibold">
                Liverpool vs Manchester City
              </p>
              <p className="mt-2 text-xs text-slate-400">Sun 19:45</p>
            </div>
          </div>
        </div>app/page.tsx
      </section>
    </main>
  );
}
