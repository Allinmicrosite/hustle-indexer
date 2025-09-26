import { ChartLine } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-primary-foreground" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Hustle Indexer</h4>
            </div>
            <p className="text-muted-foreground">
              Transparent and fair evaluations of online hustles and side gigs to help you make informed decisions.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-foreground mb-4">Browse</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-all-hustles">
                  All Hustles
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-top-rated">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-categories">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-recent-reviews">
                  Recent Reviews
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-foreground mb-4">Community</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-submit-review">
                  Submit Review
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-report-issue">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-guidelines">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-foreground mb-4">Legal</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-disclaimer">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-about">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Hustle Indexer. All rights reserved. Built with transparency in mind.</p>
        </div>
      </div>
    </footer>
  );
}
