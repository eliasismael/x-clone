import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.45),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_55%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Hero />
        <FeatureGrid />
      </div>
    </main>
  );
}
