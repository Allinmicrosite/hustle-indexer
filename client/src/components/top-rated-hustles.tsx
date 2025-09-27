import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, Clock, DollarSign, User } from "lucide-react";
import type { HustleWithReviews } from "@shared/schema";

export function TopRatedHustles() {
  const { data: hustles, isLoading } = useQuery<HustleWithReviews[]>({
    queryKey: ["/api/hustles/top-rated"],
  });

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
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-1" data-testid={`hustle-name-${hustle.id}`}>
                  {hustle.name}
                </h4>
                <p className="text-muted-foreground text-sm" data-testid={`hustle-category-${hustle.id}`}>
                  {hustle.category?.name || "Uncategorized"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(hustle.averageScore || 0)}
                <span className="font-semibold text-foreground" data-testid={`hustle-score-${hustle.id}`}>
                  {parseFloat(hustle.averageScore || "0").toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4" data-testid={`hustle-description-${hustle.id}`}>
              {hustle.description}
            </p>
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {hustle.timeCommitment || "Flexible hours"}
                </span>
                <span className="flex items-center">
                  {formatHourlyRate(hustle.hourlyRateMin, hustle.hourlyRateMax)}
                </span>
              </div>
              <span className="bg-chart-2 text-white px-2 py-1 rounded text-xs font-medium">
                High Rating
              </span>
            </div>

            {/* Recent Review Snippets */}
            {hustle.recentReviews && hustle.recentReviews.length > 0 && (
              <div className="border-t pt-2 mt-3">
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <User size={12} className="mr-1" />
                  {hustle.reviewCount} reviews
                </div>
                <div className="space-y-1">
                  {hustle.recentReviews.slice(0, 2).map((review) => (
                    <p key={review.id} className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {displayUsername(review.username, review.isAnonymous || 0)}:
                      </span> "{truncateContent(review.content, 120)}"
                    </p>
                  ))}
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
