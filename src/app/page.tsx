import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import BrandBar from "@/components/home/BrandBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PromoBanner from "@/components/home/PromoBanner";
import NewProductsSection from "@/components/home/NewProductsSection";
import StarProducts from "@/components/home/StarProducts";
import QuoteSection from "@/components/home/QuoteSection";
import SkeletonCard from "@/components/SkeletonCard";

export const revalidate = 0;


export const metadata: Metadata = {
  title: "CyberCore Gear — Premium Mechanical Keyboards",
  description:
    "Descubre nuestra colección de teclados mecánicos personalizados. Alta gama, switches premium, y diseño sin compromiso.",
};

export default async function HomePage() {
  return (
    <>
      {/* 1. Hero — ACF powered */}
      <Suspense fallback={<div className="min-h-[88vh] bg-ccg-charcoal animate-pulse" />}>
        <HeroSection />
      </Suspense>

      {/* 2. Brand Logo Bar */}
      <BrandBar />

      {/* 3. Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-russo text-3xl md:text-4xl text-ccg-black">
              Shop by <span className="text-ccg-purple">Category</span>
            </h2>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-ccg-surface rounded-2xl animate-pulse" />
                ))}
              </div>
            }
          >
            <FeaturedCategories />
          </Suspense>
        </div>
      </section>

      {/* 4. Promo Banners (dark + split) */}
      <Suspense fallback={<div className="h-[400px] bg-ccg-charcoal animate-pulse" />}>
        <PromoBanner />
      </Suspense>

      {/* 5. Most sold this week */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            }
          >
            <NewProductsSection />
          </Suspense>
        </div>
      </section>

      {/* 6. Best Sellers */}
      <section className="py-16 bg-ccg-surface border-y border-ccg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-russo text-3xl md:text-4xl text-ccg-black">
              Best <span className="text-ccg-purple">Sellers</span>
            </h2>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            }
          >
            <StarProducts />
          </Suspense>
        </div>
      </section>

      {/* 7. Stats + Quote */}
      <QuoteSection />
    </>
  );
}
