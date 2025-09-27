import { Button } from "@/components/ui/button";

export function CallToAction() {
  const handleSubmitReview = () => {
    // TODO: Open submit review modal/page
    console.log("Opening submit review form");
  };


  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary to-chart-1">
      <div className="container mx-auto max-w-4xl text-center">
        <h3 className="text-3xl font-bold text-primary-foreground mb-4">
          Help Others Make Informed Decisions
        </h3>
        <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
          Share your experience or point us to reviews you've found online. Every submission is reviewed by our team before it's published to ensure accuracy and protect against spam. Your input helps us build a transparent and trustworthy community.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitReview}
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg"
            data-testid="button-suggest-review"
          >
            Suggest a Review
          </Button>
        </div>
      </div>
    </section>
  );
}
