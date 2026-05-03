import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/catalog/CatalogClient";
import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/lib/queries";
import SkeletonCard from "@/components/SkeletonCard";

export const metadata: Metadata = {
  title: "Catálogo — CyberCore Gear",
  description:
    "Explora nuestra colección completa de teclados mecánicos. Filtra por layout, switch, precio y más.",
};

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { category, minPrice, maxPrice } = await searchParams;

  let products: unknown[] = [];
  let categories: unknown[] = [];
  let hasNextPage = false;

  try {
    const [productsRes, catsRes] = await Promise.all([
      getClient().query({
        query: GET_PRODUCTS,
        variables: {
          first: 12,
          category: category || undefined,
        },
      }),
      getClient().query({ query: GET_CATEGORIES }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pData = productsRes.data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cData = catsRes.data as any;
    products = pData?.products?.nodes ?? [];
    hasNextPage = pData?.products?.pageInfo?.hasNextPage ?? false;
    categories = cData?.productCategories?.nodes ?? [];
  } catch (e) {
    console.error("CatalogPage fetch error:", e);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-ccg-border bg-ccg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-russo text-3xl md:text-4xl text-ccg-black">
            {category ? (
              <>
                Category:{" "}
                <span className="text-ccg-purple capitalize">{category.replace(/-/g, " ")}</span>
              </>
            ) : (
              <>
                All <span className="text-ccg-purple">Keyboards</span>
              </>
            )}
          </h1>
          <p className="text-ccg-muted text-sm mt-2">
            Browse our full collection of premium mechanical keyboards.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        }
      >
        <CatalogClient
          initialProducts={products}
          categories={categories}
          activeCategory={category}
          hasNextPage={hasNextPage}
        />
      </Suspense>
    </div>
  );
}
