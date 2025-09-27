import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, DollarSign } from "lucide-react";
import type { HustleWithCategory } from "@shared/schema";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchResults, isLoading } = useQuery<HustleWithCategory[]>({
    queryKey: ["/api/hustles", searchQuery],
    enabled: hasSearched && searchQuery.trim().length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/hustles?search=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderStars = (score: string | number) => {
    const numScore = typeof score === "string" ? parseFloat(score) : score;
    const fullStars = Math.floor(numScore / 2);
    const hasHalfStar = (numScore / 2) % 1 !== 0;
    
    return (
      <div className="flex rating-stars">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < fullStars ? "fill-current" : i === fullStars && hasHalfStar ? "fill-current opacity-50" : ""}
          />
        ))}
      </div>
    );
  };

  const formatHourlyRate = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "$ Varies";
    if (min && max) return `$${min}-${max}/hr`;
    if (min) return `$${min}+/hr`;
    return `Up to $${max}/hr`;
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Search card with faint background */}
      <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-4">
        {/* Desktop Layout - Button outside input */}
        <div className="hidden sm:flex gap-3 mb-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-muted-foreground" size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search for hustles, side gigs, or online opportunities..."
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg text-lg focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="input-search"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-4"
            data-testid="button-search"
          >
            Search
          </Button>
        </div>
        
        {/* Mobile Layout - Button below input */}
        <div className="block sm:hidden mb-3">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-muted-foreground" size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search for hustles"
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg text-lg focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="input-search-mobile"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6"
              data-testid="button-search-mobile"
            >
              Search
            </Button>
          </div>
        </div>
        
        {/* Keywords inside the search card, centered */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Popular: Dropshipping · Affiliate Marketing · Online Tutoring · Content Creation · Freelancing · Writing · Branding · Web Design · Web Development · E-commerce · Image Sales · T-Shirt Designs
          </p>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-card border border-border rounded-lg p-4 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            Search Results {searchQuery && `for "${searchQuery}"`}
          </h3>
          
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted/30 p-4 rounded-lg animate-pulse">
                  <div className="h-5 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && searchResults && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((hustle) => (
                <Link key={hustle.id} href={`/hustle/${hustle.id}`}>
                  <div className="bg-background p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer" data-testid={`search-result-${hustle.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground hover:text-primary transition-colors" data-testid={`search-hustle-name-${hustle.id}`}>
                          {hustle.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {hustle.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(hustle.averageScore || 0)}
                        <span className="font-semibold text-foreground">
                          {parseFloat(hustle.averageScore || "0").toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 text-left">{hustle.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {hustle.timeCommitment || "Flexible"}
                        </span>
                        <span className="flex items-center">
                          {formatHourlyRate(hustle.hourlyRateMin, hustle.hourlyRateMax)}
                        </span>
                        <span>{hustle.reviewCount || 0} reviews</span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-md font-medium">
                          More
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!isLoading && searchResults && searchResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hustles found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or browse all hustles below.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
