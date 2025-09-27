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
        
        <SearchBar />
        
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mb-8">
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

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border border-blue-200 dark:border-blue-800 rounded-lg p-6 flex">
            <div className="mr-4 self-stretch flex items-center">
              <svg className="w-4 h-full text-primary" viewBox="0 0 20 100" preserveAspectRatio="none">
                <path 
                  d="M 15 5 Q 5 5 5 15 L 5 85 Q 5 95 15 95" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-foreground leading-relaxed font-medium text-left flex-1">
              Discover side hustles with transparent reviews and community ratings. Compare costs, risks, and ROI before you commit.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border border-green-200 dark:border-green-800 rounded-lg p-6 flex">
            <div className="mr-4 self-stretch flex items-center">
              <svg className="w-4 h-full text-primary" viewBox="0 0 20 100" preserveAspectRatio="none">
                <path 
                  d="M 15 5 Q 5 5 5 15 L 5 85 Q 5 95 15 95" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-foreground leading-relaxed font-medium text-left flex-1">
              Hustle Indexer scores business models and promoters separately, exposing proven systems vs. hype-filled sales claims.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
