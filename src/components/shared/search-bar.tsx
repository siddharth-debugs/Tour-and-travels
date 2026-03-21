"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Destination {
  value: string;
  label: string;
}

interface SearchBarProps {
  destinations: Destination[];
  className?: string;
}

export function SearchBar({ destinations, className }: SearchBarProps) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("2");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (travelers) params.set("travelers", travelers);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl bg-background/95 backdrop-blur-md p-3 sm:p-2 shadow-2xl ring-1 ring-border/50",
        className
      )}
    >
      {/* Destination Select */}
      <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-1">
        <MapPin className="size-4 text-primary shrink-0" />
        <Select value={destination} onValueChange={(v) => setDestination(v ?? "")}>
          <SelectTrigger className="border-0 shadow-none focus-visible:ring-0 h-9 w-full bg-transparent text-foreground data-placeholder:text-muted-foreground">
            <SelectValue placeholder="Where do you want to go?" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((dest) => (
              <SelectItem key={dest.value} value={dest.value}>
                {dest.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-border/60 shrink-0" />

      {/* Travelers Input */}
      <div className="flex items-center gap-2 px-3 py-1 w-full sm:w-44 shrink-0">
        <Users className="size-4 text-primary shrink-0" />
        <Input
          type="number"
          min={1}
          max={50}
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          placeholder="Travelers"
          className="border-0 shadow-none focus-visible:ring-0 h-9 bg-transparent p-0 text-sm"
        />
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size="sm"
        className="h-10 px-6 font-semibold gap-2 shrink-0 rounded-xl sm:rounded-xl"
      >
        <Search className="size-4" />
        Search
      </Button>
    </div>
  );
}
