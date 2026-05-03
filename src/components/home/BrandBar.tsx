"use client";

const BRANDS = ["Keychron", "GMK", "Gateron", "Akko", "Glorious", "Ducky", "GMMK", "Rama"];

export default function BrandBar() {
  return (
    <div className="border-y border-ccg-border py-5 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around gap-6 flex-wrap">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="font-russo text-ccg-muted hover:text-ccg-purple text-sm tracking-widest uppercase cursor-pointer transition-colors duration-200 whitespace-nowrap"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
