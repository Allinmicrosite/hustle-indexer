import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-muted-foreground" size={20} />
        </div>
        <Input
          type="text"
          placeholder="Search for hustles, side gigs, or online opportunities..."
          className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg text-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="input-search"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          data-testid="button-search"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
