import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { HustleWithCategory, Category } from "@shared/schema";

interface CategoryAverage {
  category: Category;
  averageScore: number;
  hustleCount: number;
}

export function SidebarWidgets() {
  const { data: recentHustles, isLoading: loadingRecent } = useQuery<HustleWithCategory[]>({
    queryKey: ["/api/hustles/recent"],
  });

  const { data: categoryAverages, isLoading: loadingAverages } = useQuery<CategoryAverage[]>({
    queryKey: ["/api/categories/averages"],
  });

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = (score / 2) % 1 !== 0;
    
    return (
      <div className="flex rating-stars text-sm">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < fullStars ? "fill-current" : i === fullStars && hasHalfStar ? "fill-current opacity-50" : ""}
          />
        ))}
      </div>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-8">
      {/* Recent Additions */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Additions</h3>
        <div className="space-y-4">
          {loadingRecent ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-1 w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            ))
          ) : recentHustles?.length ? (
            recentHustles.map((hustle) => (
              <div key={hustle.id} className="flex items-start space-x-3" data-testid={`recent-hustle-${hustle.id}`}>
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground" data-testid={`recent-hustle-name-${hustle.id}`}>
                    {hustle.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(hustle.createdAt?.toString() || "")}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground" data-testid={`recent-hustle-score-${hustle.id}`}>
                  {hustle.reviewCount > 0 ? parseFloat(hustle.averageScore || "0").toFixed(1) : "Pending"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No recent additions
            </div>
          )}
        </div>
      </div>

      {/* Category Averages */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Category Averages</h3>
        <div className="space-y-4">
          {loadingAverages ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-1 w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded mb-1 w-8"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))
          ) : categoryAverages?.length ? (
            categoryAverages.slice(0, 6).map((category) => (
              <div 
                key={category.category.id} 
                className="flex items-center justify-between"
                data-testid={`category-average-${category.category.id}`}
              >
                <div>
                  <h4 className="font-medium text-foreground" data-testid={`category-name-${category.category.id}`}>
                    {category.category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {category.hustleCount} hustles
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground" data-testid={`category-score-${category.category.id}`}>
                    {category.averageScore ? category.averageScore.toFixed(1) : "N/A"}
                  </div>
                  {category.averageScore && renderStars(category.averageScore)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No categories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
