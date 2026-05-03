"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string; databaseId: number; slug: string; name: string;
  price: string; regularPrice?: string; salePrice?: string; onSale?: boolean;
  averageRating?: number; reviewCount?: number;
  image?: { sourceUrl: string; altText: string };
  productCategories?: { nodes: { name: string; slug: string }[] };
}
interface Category { id: string; name: string; slug: string; count?: number; }
interface Props {
  initialProducts: unknown[]; categories: unknown[];
  activeCategory?: string; hasNextPage: boolean;
}

const LAYOUT_FILTERS = ["60%", "65%", "75%", "TKL", "Full Size"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

export default function CatalogClient({ initialProducts, categories, activeCategory }: Props) {
  const router = useRouter();
  const products = initialProducts as Product[];
  const cats = categories as Category[];
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [layoutFilter, setLayoutFilter] = useState<string[]>([]);
  const [expanded, setExpanded] = useState({ categories: true, layout: true });

  const toggle = (key: keyof typeof expanded) => setExpanded(s => ({ ...s, [key]: !s[key] }));
  const setCategory = (slug: string | null) =>
    slug ? router.push(`/catalog?category=${slug}`) : router.push("/catalog");
  const toggleLayout = (l: string) =>
    setLayoutFilter(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  const filtered = layoutFilter.length === 0 ? products : products.filter(p =>
    layoutFilter.some(lf =>
      p.name.toLowerCase().includes(lf.toLowerCase()) ||
      p.productCategories?.nodes.some(c => c.name.toLowerCase().includes(lf.toLowerCase()))
    )
  );
  const sorted = [...filtered].sort((a, b) => {
    const pa = parseFloat(a.price?.replace(/[^0-9.]/g, "") || "0");
    const pb = parseFloat(b.price?.replace(/[^0-9.]/g, "") || "0");
    if (sortBy === "price_asc") return pa - pb;
    if (sortBy === "price_desc") return pb - pa;
    return 0;
  });

  const FilterSidebar = () => (
    <aside className="space-y-2">
      <h2 className="font-russo text-ccg-black text-base mb-4">Filters</h2>

      {/* Categories */}
      <div className="border border-ccg-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggle("categories")}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ccg-black bg-white hover:bg-ccg-surface transition-colors cursor-pointer"
        >
          Category
          {expanded.categories
            ? <ChevronUp className="w-4 h-4 text-ccg-muted" />
            : <ChevronDown className="w-4 h-4 text-ccg-muted" />}
        </button>
        <AnimatePresence>
          {expanded.categories && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden bg-ccg-surface"
            >
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={() => setCategory(null)}
                  className={`w-full text-left flex items-center gap-2.5 py-1 text-sm cursor-pointer transition-colors ${
                    !activeCategory ? "text-ccg-purple font-semibold" : "text-ccg-muted hover:text-ccg-black"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    !activeCategory ? "bg-ccg-purple" : "bg-ccg-border"
                  }`} />
                  All Products
                </button>
                {cats.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full text-left flex items-center gap-2.5 py-1 text-sm cursor-pointer transition-colors ${
                      activeCategory === cat.slug
                        ? "text-ccg-purple font-semibold"
                        : "text-ccg-muted hover:text-ccg-black"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      activeCategory === cat.slug ? "bg-ccg-purple" : "bg-ccg-border"
                    }`} />
                    {cat.name}
                    {cat.count != null && (
                      <span className="text-ccg-muted text-xs ml-auto">({cat.count})</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layout */}
      <div className="border border-ccg-border rounded-xl overflow-hidden">
        <button
          onClick={() => toggle("layout")}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ccg-black bg-white hover:bg-ccg-surface transition-colors cursor-pointer"
        >
          Layout
          {expanded.layout
            ? <ChevronUp className="w-4 h-4 text-ccg-muted" />
            : <ChevronDown className="w-4 h-4 text-ccg-muted" />}
        </button>
        <AnimatePresence>
          {expanded.layout && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden bg-ccg-surface"
            >
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {LAYOUT_FILTERS.map(l => (
                  <button
                    key={l}
                    onClick={() => toggleLayout(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                      layoutFilter.includes(l)
                        ? "bg-ccg-purple text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]"
                        : "bg-white border border-ccg-border text-ccg-muted hover:border-ccg-purple/40 hover:text-ccg-purple"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Active chips */}
      {(activeCategory || layoutFilter.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeCategory && (
            <span className="flex items-center gap-1.5 bg-ccg-purple-light border border-ccg-purple/20 text-ccg-purple text-xs px-3 py-1 rounded-full">
              {activeCategory}
              <button onClick={() => setCategory(null)} className="cursor-pointer hover:text-ccg-purple-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {layoutFilter.map(l => (
            <span key={l} className="flex items-center gap-1.5 bg-ccg-purple-light border border-ccg-purple/20 text-ccg-purple text-xs px-3 py-1 rounded-full">
              {l}
              <button onClick={() => toggleLayout(l)} className="cursor-pointer hover:text-ccg-purple-dark">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-ccg-border text-ccg-muted hover:text-ccg-purple hover:border-ccg-purple/40 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <p className="text-ccg-muted text-sm">
                <span className="text-ccg-black font-medium">{sorted.length}</span> products
              </p>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-ccg-border text-ccg-muted text-sm rounded-lg px-3 py-2 cursor-pointer hover:border-ccg-purple/40 focus:border-ccg-purple outline-none transition-all duration-200"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-russo text-2xl text-ccg-black mb-4">No products found</p>
              <p className="text-ccg-muted text-sm mb-6">Try adjusting your filters.</p>
              <button
                onClick={() => { setLayoutFilter([]); setCategory(null); }}
                className="inline-flex items-center gap-2 bg-ccg-purple text-white font-semibold px-6 py-3 rounded-xl text-sm cursor-pointer hover:bg-ccg-purple-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sorted.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.databaseId} slug={product.slug} name={product.name}
                  price={product.price} regularPrice={product.regularPrice}
                  salePrice={product.salePrice} onSale={product.onSale}
                  imageUrl={product.image?.sourceUrl} imageAlt={product.image?.altText}
                  category={product.productCategories?.nodes[0]?.name}
                  rating={product.averageRating} reviewCount={product.reviewCount}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-ccg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-ccg-border overflow-y-auto lg:hidden shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-ccg-border">
                <span className="font-russo text-ccg-black">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-ccg-muted hover:text-ccg-black cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4"><FilterSidebar /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
