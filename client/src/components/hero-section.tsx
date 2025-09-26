import { SearchBar } from "@/components/search-bar";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-card to-background py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
          Hustle Indexer
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Fair & Transparent Side Hustle Evaluations
        </p>
        
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
          Make informed decisions about online hustles and side gigs with our community-driven scoring system. 
          Get honest reviews, transparent ratings, and comprehensive evaluations of online opportunities.
        </p>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-foreground font-medium leading-relaxed">
            <span className="text-primary font-semibold">Our Unique Approach:</span> Hustle Indexer evaluates both business models and the people who promote them. We score each pitch separately from the system it's based on, so you can see the difference between a proven method and someone's unrealistic sales claims.
          </p>
        </div>
        
        <p className="text-lg text-foreground mb-6 max-w-3xl mx-auto">
          Search our growing database of side hustles and see how they score for transparency, cost-to-value, repeatability, and success potential.
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
