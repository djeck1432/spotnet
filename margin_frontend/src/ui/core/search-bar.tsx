import * as React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  className = "",
  onChange,
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#848484]"
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-12 bg-[#131313] border border-[#252525] rounded-md pl-12 pr-4 text-[#fffcfc] placeholder:text-[#898989] focus:outline-none focus:ring-1 focus:ring-[#ffb80d] transition-colors"
      />
    </div>
  );
}
