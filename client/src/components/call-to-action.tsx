import { Button } from "@/components/ui/button";

export function CallToAction() {
  const handleSubmitReview = () => {
    // TODO: Open submit review modal/page
    console.log("Opening submit review form");
  };

  const handleAddHustle = () => {
    // TODO: Open add hustle modal/page
    console.log("Opening add hustle form");
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary to-chart-1">
      <div className="container mx-auto max-w-4xl text-center">
        <h3 className="text-3xl font-bold text-primary-foreground mb-4">
          Help Others Make Informed Decisions
        </h3>
        <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
          Share your experience with online hustles and side gigs. Your honest review helps build a more transparent community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSubmitReview}
            className="bg-card text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-card/90 transition-colors"
            data-testid="button-submit-review"
          >
            Submit a Review
          </Button>
          <Button
            onClick={handleAddHustle}
            variant="outline"
            className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            data-testid="button-add-hustle"
          >
            Add New Hustle
          </Button>
        </div>
      </div>
    </section>
  );
}
