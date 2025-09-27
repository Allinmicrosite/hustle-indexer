import { useQuery } from "@tanstack/react-query";
import { TopRatedHustles } from "@/components/top-rated-hustles";
import { SidebarWidgets } from "@/components/sidebar-widgets";

interface Statistics {
  totalHustles: number;
  totalReviews: number;
  averageScore: number;
  newThisWeek: number;
}

export function SummaryDashboard() {
  const { data: statistics, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  if (isLoading) {
    return (
      <section className="pt-8 pb-16 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border text-center animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-total-hustles">
              {statistics?.totalHustles?.toLocaleString() || 0}
            </div>
            <div className="text-muted-foreground">Hustles Reviewed</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-chart-2 mb-2" data-testid="stat-average-score">
              {statistics?.averageScore ? parseFloat(statistics.averageScore.toString()).toFixed(1) : "0.0"}
            </div>
            <div className="text-muted-foreground">Average Score</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-chart-3 mb-2" data-testid="stat-total-reviews">
              {statistics?.totalReviews?.toLocaleString() || 0}
            </div>
            <div className="text-muted-foreground">User Reviews</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border text-center">
            <div className="text-3xl font-bold text-chart-4 mb-2" data-testid="stat-new-this-week">
              {statistics?.newThisWeek || 0}
            </div>
            <div className="text-muted-foreground">Added This Week</div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TopRatedHustles />
          <SidebarWidgets />
        </div>
      </div>
    </section>
  );
}
