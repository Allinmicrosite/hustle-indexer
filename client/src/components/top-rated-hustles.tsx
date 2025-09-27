import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, Clock, DollarSign, User, ArrowRight } from "lucide-react";
import type { HustleWithReviews } from "@shared/schema";

export function TopRatedHustles() {
  const { data: hustles, isLoading } = useQuery<HustleWithReviews[]>({
    queryKey: ["/api/hustles/top-rated"],
  });

  const renderTrafficLight = (rating: number) => {
    const redFilled = rating < 2.5;
    const yellowFilled = rating >= 2.5 && rating < 4.0;
    const greenFilled = rating >= 4.0;
    
    return (
      <div className="flex items-center space-x-1.5 py-0.5">
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${
          redFilled ? 'bg-red-500 border-red-500' : 'border-red-500/60 bg-transparent'
        }`}></div>
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${
          yellowFilled ? 'bg-yellow-500 border-yellow-500' : 'border-yellow-500/60 bg-transparent'
        }`}></div>
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${
          greenFilled ? 'bg-green-500 border-green-500' : 'border-green-500/60 bg-transparent'
        }`}></div>
      </div>
    );
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
            size={16}
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

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const displayUsername = (username: string, isAnonymous: number) => {
    return isAnonymous ? "Anonymous" : username;
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-semibold text-foreground mb-6">Top-Rated Hustles</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
              <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <h3 className="text-2xl font-semibold text-foreground mb-6">Top-Rated Hustles</h3>
      <div className="space-y-4">
        {hustles?.map((hustle) => (
          <Link key={hustle.id} href={`/hustle/${hustle.id}`}>
            <div 
              className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
              data-testid={`hustle-card-${hustle.id}`}
            >
            {/* Header row: Title + stars */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-1" data-testid={`hustle-name-${hustle.id}`}>
                  {hustle.name}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(hustle.averageScore || 0)}
                <span className="font-semibold text-foreground" data-testid={`hustle-score-${hustle.id}`}>
                  {parseFloat(hustle.averageScore || "0").toFixed(1)}
                </span>
              </div>
            </div>

            {/* Next Row: Subject, Type, $, Rating */}
            <div className="flex items-center text-sm mb-3 text-muted-foreground">
              <div className="flex items-center space-x-3">
                <span className="border-2 border-muted-foreground/40 text-muted-foreground px-2 py-0.5 rounded text-xs font-medium" data-testid={`hustle-category-${hustle.id}`}>
                  {hustle.category?.name || "Uncategorized"}
                </span>
                <span className="border-2 border-muted-foreground/40 text-muted-foreground px-2 py-0.5 rounded text-xs font-medium flex items-center">
                  <Clock size={12} className="mr-1" />
                  {hustle.timeCommitment || "Flexible"}
                </span>
                <span className="border-2 border-muted-foreground/40 text-muted-foreground px-2 py-0.5 rounded text-xs font-medium flex items-center">
                  {formatHourlyRate(hustle.hourlyRateMin, hustle.hourlyRateMax)}
                </span>
                <span className="border-2 border-muted-foreground/40 px-2 py-0.5 rounded text-xs font-medium flex items-center justify-center min-w-[50px]">
                  {renderTrafficLight(parseFloat(hustle.averageScore || "0"))}
                </span>
              </div>
            </div>

            {/* Middle: Description */}
            <p className="text-muted-foreground mb-4" data-testid={`hustle-description-${hustle.id}`}>
              {hustle.description}
            </p>

            {/* Review section: 2 small rounded boxes */}
            {hustle.recentReviews && hustle.recentReviews.length > 0 && (
              <div className="flex items-end justify-between">
                <div className="flex gap-3 flex-1">
                  {hustle.recentReviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="bg-secondary/20 border border-border rounded-lg p-3 text-xs flex-1 shadow-sm">
                      <div className="font-bold text-foreground mb-1">
                        {displayUsername(review.username, review.isAnonymous || 0)}
                      </div>
                      <div className="text-muted-foreground">
                        "{truncateContent(review.content, 80)}"
                      </div>
                    </div>
                  ))}
                </div>
                {/* Bottom-right: "More →" button */}
                <div className="ml-4">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-xs font-medium flex items-center hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer">
                    <span>More</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            )}

            {/* If no reviews, still show the More button */}
            {(!hustle.recentReviews || hustle.recentReviews.length === 0) && (
              <div className="flex justify-end">
                <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-xs font-medium flex items-center hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer">
                  <span>More</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            )}
            </div>
          </Link>
        ))}
        
        {!hustles?.length && (
          <div className="text-center py-8 text-muted-foreground">
            No hustles found. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  );
}
