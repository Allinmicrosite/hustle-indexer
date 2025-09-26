import { SearchBar } from "@/components/search-bar";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-card to-background py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Fair & Transparent<br />
          <span className="text-primary">Hustle Evaluation</span>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
          Make informed decisions about online hustles and side gigs with our community-driven scoring system. 
          Get honest reviews, transparent ratings, and comprehensive evaluations of online opportunities.
        </p>
        
        <SearchBar />
        
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <span className="bg-secondary px-3 py-1 rounded-full" data-testid="tag-dropshipping">
            Popular: Dropshipping
          </span>
          <span className="bg-secondary px-3 py-1 rounded-full" data-testid="tag-affiliate">
            Affiliate Marketing
          </span>
          <span className="bg-secondary px-3 py-1 rounded-full" data-testid="tag-tutoring">
            Online Tutoring
          </span>
          <span className="bg-secondary px-3 py-1 rounded-full" data-testid="tag-content">
            Content Creation
          </span>
        </div>
      </div>
    </section>
  );
}
