import { fetchFootballNews } from "@/lib/news";
import HeroSection from "@/components/home/HeroSection";
import MatchSchedule from "@/components/home/MatchSchedule";
import FeaturedVideos from "@/components/home/FeaturedVideos";
import SportNews from "@/components/home/SportNews";
import LeagueTable from "@/components/home/LeagueTable";
import PunditsStrip from "@/components/home/PunditsStrip";
import FooterBar from "@/components/home/FooterBar";

export default async function HomePage() {
  const articles = await fetchFootballNews().catch(() => []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <HeroSection articles={articles.slice(0, 6)} />
      <MatchSchedule />
      <FeaturedVideos />
      <SportNews />

      <LeagueTable />

      <PunditsStrip />
      <FooterBar />
    </main>
  );
}