import { SearchBar } from "@/components/search-bar";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-card to-background pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
          Hustle Indexer
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Fair & Transparent Side Hustle Evaluations
        </p>
        
        <SearchBar />
        
        {/* Subtle keyword card */}
        <div className="border border-border rounded-lg px-4 py-3 mb-4 max-w-2xl mx-auto" data-testid="keywords-card">
          <p className="text-sm text-foreground">
            Popular: Dropshipping · Affiliate Marketing · Online Tutoring · Content Creation
          </p>
        </div>
        
        {/* Slim one-liner */}
        <p className="text-muted-foreground mb-8">
          Compare costs, risks, and ROI. See which hustles deliver — and which are just hype.
        </p>
      </div>
    </section>
  );
}
