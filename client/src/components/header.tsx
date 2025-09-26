import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartLine, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ChartLine className="text-primary-foreground text-lg" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="logo-title">
            Hustle Indexer
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-browse"
          >
            Browse Hustles
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-categories"
          >
            Categories
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-submit"
          >
            Submit Review
          </a>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            data-testid="button-signin"
          >
            Sign In
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-mobile-browse"
              >
                Browse Hustles
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-mobile-categories"
              >
                Categories
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-mobile-submit"
              >
                Submit Review
              </a>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium w-fit"
                data-testid="button-mobile-signin"
              >
                Sign In
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
