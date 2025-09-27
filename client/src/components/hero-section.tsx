import { SearchBar } from "@/components/search-bar";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-card to-background pt-16 pb-4 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
          Hustle Indexer
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Fair & Transparent Side Hustle Evaluations
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Compare costs, risks, and ROI. See which hustles deliver — and which are just hype.
        </p>
        
        <SearchBar />
      </div>
    </section>
  );
}
