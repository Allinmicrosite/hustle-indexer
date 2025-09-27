import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewFormModal } from "@/components/review-form-modal";
import { Star, Clock, DollarSign, Users, ArrowLeft, TrendingUp, Shield, Target, ThumbsUp, ThumbsDown } from "lucide-react";
import type { HustleWithCategory, Review } from "@shared/schema";

export default function HustleDetail() {
  const { id } = useParams();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: hustle, isLoading: hustleLoading } = useQuery<HustleWithCategory>({
    queryKey: ["/api/hustles", id],
    queryFn: async () => {
      const response = await fetch(`/api/hustles/${id}`);
      if (!response.ok) throw new Error('Failed to fetch hustle');
      return response.json();
    },
    enabled: !!id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/hustles", id, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/hustles/${id}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
    enabled: !!id,
  });

  const renderStars = (score: string | number, size: number = 16) => {
    const numScore = typeof score === "string" ? parseFloat(score) : score;
    const fullStars = Math.floor(numScore / 2);
    const hasHalfStar = (numScore / 2) % 1 !== 0;
    
    return (
      <div className="flex rating-stars">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
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

  const getDifficultyLabel = (level?: number | null) => {
    if (!level) return "Not specified";
    const labels = ["", "Beginner", "Easy", "Moderate", "Advanced", "Expert"];
    return labels[level] || "Unknown";
  };

  const getDifficultyColor = (level?: number | null) => {
    if (!level) return "bg-muted";
    if (level <= 2) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (level <= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayReviewSource = (review: { sourcePlatform?: string; sourceDate?: string; sourceVerified?: number | null }) => {
    if (!review.sourcePlatform || !review.sourceDate) return "Reviewer";
    const verifiedText = review.sourceVerified ? " • Verified" : "";
    return `${review.sourcePlatform} comment • ${review.sourceDate}${verifiedText}`;
  };

  if (hustleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hustle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Hustle Not Found</h1>
          <p className="text-muted-foreground mb-8">The hustle you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2" size={16} />
            Back to Search
          </Button>
        </Link>

        {/* Hustle Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-foreground" data-testid="hustle-title">
                  {hustle.name}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  {hustle.category?.name || "Uncategorized"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(hustle.averageScore || 0, 20)}
                  <span className="text-2xl font-bold text-foreground" data-testid="overall-score">
                    {parseFloat(hustle.averageScore || "0").toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({hustle.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="hustle-description">
                {hustle.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {formatHourlyRate(hustle.hourlyRateMin, hustle.hourlyRateMax)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-blue-600" size={16} />
                  <span className="text-muted-foreground">
                    {hustle.timeCommitment || "Flexible"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="text-purple-600" size={16} />
                  <Badge className={getDifficultyColor(hustle.difficultyLevel)}>
                    {getDifficultyLabel(hustle.difficultyLevel)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-orange-600" size={16} />
                  <span className="text-muted-foreground">
                    {hustle.reviewCount || 0} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags and Requirements */}
        {(hustle.tags?.length || hustle.requirements?.length) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {hustle.tags?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hustle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {hustle.requirements?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hustle.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Shield className="text-blue-600 mt-0.5" size={14} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Community Reviews</CardTitle>
            <p className="text-muted-foreground">
              See what others are saying about this hustle opportunity
            </p>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : reviews?.length ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground" data-testid={`review-title-${review.id}`}>
                          {review.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {displayReviewSource(review)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.overallScore || 0)}
                        <span className="font-semibold">
                          {parseFloat(review.overallScore?.toString() || "0").toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {review.content}
                    </p>

                    {/* Detailed Scores */}
                    {(review.earningPotentialScore || review.timeInvestmentScore || review.difficultyScore || review.legitimacyScore) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                        {review.earningPotentialScore && (
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Earning Potential</div>
                            <div className="text-lg font-bold text-foreground">{parseFloat(review.earningPotentialScore.toString()).toFixed(1)}</div>
                          </div>
                        )}
                        {review.timeInvestmentScore && (
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Time Investment</div>
                            <div className="text-lg font-bold text-foreground">{parseFloat(review.timeInvestmentScore.toString()).toFixed(1)}</div>
                          </div>
                        )}
                        {review.difficultyScore && (
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Difficulty</div>
                            <div className="text-lg font-bold text-foreground">{parseFloat(review.difficultyScore.toString()).toFixed(1)}</div>
                          </div>
                        )}
                        {review.legitimacyScore && (
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Legitimacy</div>
                            <div className="text-lg font-bold text-foreground">{parseFloat(review.legitimacyScore.toString()).toFixed(1)}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pros and Cons */}
                    {(review.pros?.length || review.cons?.length) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {review.pros?.length && (
                          <div>
                            <h5 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                              <ThumbsUp size={14} />
                              Pros
                            </h5>
                            <ul className="space-y-1">
                              {review.pros.map((pro, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons?.length && (
                          <div>
                            <h5 className="font-medium text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                              <ThumbsDown size={14} />
                              Cons
                            </h5>
                            <ul className="space-y-1">
                              {review.cons.map((con, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-red-600 mt-1">•</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Financial Info */}
                    {(review.monthlyEarnings || review.timeSpentHours || review.experienceMonths) && (
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {review.monthlyEarnings && (
                          <span className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            Monthly earnings: ${review.monthlyEarnings}
                          </span>
                        )}
                        {review.timeSpentHours && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {review.timeSpentHours} hours/week
                          </span>
                        )}
                        {review.experienceMonths && (
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {review.experienceMonths} months experience
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reviews yet for this hustle.</p>
                <p className="text-sm mt-2">Be the first to share your experience!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Have experience with {hustle.name}?
            </h3>
            <p className="text-muted-foreground mb-4">
              Help others make informed decisions by sharing your honest review and rating.
            </p>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90" 
              data-testid="button-write-review"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write a Review
            </Button>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {hustle && (
        <ReviewFormModal
          hustleId={hustle.id}
          hustleName={hustle.name}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}