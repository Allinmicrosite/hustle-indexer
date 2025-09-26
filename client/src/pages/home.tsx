import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SummaryDashboard />
      <CallToAction />
      <Footer />
    </div>
  );
}
