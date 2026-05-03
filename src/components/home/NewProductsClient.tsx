"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  averageRating?: number;
  reviewCount?: number;
  image?: { sourceUrl: string; altText: string };
  productCategories?: { nodes: { name: string; slug: string }[] };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialProducts: unknown[];
  categories: unknown[];
}

export default function NewProductsClient({ initialProducts, categories }: Props) {
  const products = initialProducts as Product[];
  const cats = categories as Category[];
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) =>
          p.productCategories?.nodes.some((c) => c.slug === activeFilter)
        );

  return (
    <div>
      {/* Header with filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-russo text-3xl md:text-4xl text-ccg-black">
          Most sold <span className="text-ccg-purple">this week</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
              activeFilter === "all"
                ? "bg-ccg-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                : "text-ccg-muted hover:text-ccg-black"
            }`}
          >
            All
          </button>
          {cats.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
                activeFilter === cat.slug
                  ? "bg-ccg-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                  : "text-ccg-muted hover:text-ccg-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ccg-muted">
          <p className="text-lg">No products found in this category.</p>
        </div>
      ) : (
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filtered.slice(0, 8).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <ProductCard
                id={product.databaseId}
                slug={product.slug}
                name={product.name}
                price={product.price}
                regularPrice={product.regularPrice}
                salePrice={product.salePrice}
                onSale={product.onSale}
                imageUrl={product.image?.sourceUrl}
                imageAlt={product.image?.altText}
                category={product.productCategories?.nodes[0]?.name}
                rating={product.averageRating}
                reviewCount={product.reviewCount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* View all */}
      <div className="text-center mt-10">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 border-2 border-ccg-border hover:border-ccg-purple text-ccg-muted hover:text-ccg-purple font-semibold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm"
        >
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
