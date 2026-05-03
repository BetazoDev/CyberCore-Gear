import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_CATEGORIES } from "@/lib/queries";

interface Category {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  image?: { sourceUrl: string; altText: string };
}

const FALLBACK_CATEGORIES = [
  { id: "1", name: "Earphones", slug: "earphones", count: 11, image: undefined as undefined | { sourceUrl: string; altText: string } },
  { id: "2", name: "Headphones", slug: "headphones", count: 8, image: undefined as undefined | { sourceUrl: string; altText: string } },
  { id: "3", name: "Microphones", slug: "microphones", count: 6, image: undefined as undefined | { sourceUrl: string; altText: string } },
  { id: "4", name: "Smartwatches", slug: "smartwatches", count: 7, image: undefined as undefined | { sourceUrl: string; altText: string } },
];

export default async function FeaturedCategories() {
  let categories: Category[] = [];

  try {
    const client = await getClient();
    const { data } = await client.query({ query: GET_CATEGORIES });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = (data as any)?.productCategories?.nodes?.slice(0, 4) ?? [];
  } catch (e) {
    console.error("FeaturedCategories fetch error:", e);
  }

  const display = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {display.map((cat) => (
        <Link
          key={cat.id}
          href={`/catalog?category=${cat.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-white border border-ccg-border cursor-pointer
                     transition-all duration-300
                     hover:border-ccg-purple/40
                     hover:shadow-[0_8px_40px_rgba(124,58,237,0.12)]"
        >
          {/* Image or placeholder */}
          <div className="relative aspect-square overflow-hidden bg-ccg-surface">
            {cat.image?.sourceUrl ? (
              <Image
                src={cat.image.sourceUrl}
                alt={cat.image.altText || cat.name}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ) : (
              /* Decorative placeholder with purple accent */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-14 rounded-xl border-2 border-ccg-purple/20 group-hover:border-ccg-purple/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-0.5 p-1.5">
                    {[...Array(12)].map((_, ki) => (
                      <div key={ki} className="w-2 h-2 rounded-sm bg-ccg-border group-hover:bg-ccg-purple/20 transition-colors duration-300" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="px-4 pb-4 pt-2">
            {cat.count > 0 && (
              <p className="text-ccg-muted text-[10px] uppercase tracking-[0.15em] mb-0.5">
                {cat.count} Products
              </p>
            )}
            <div className="flex items-center justify-between">
              <h3 className="font-russo text-ccg-text text-sm group-hover:text-ccg-purple transition-colors duration-200">
                {cat.name}
              </h3>
              <ArrowRight className="w-3.5 h-3.5 text-ccg-muted group-hover:text-ccg-purple opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            <p className="text-[10px] text-ccg-muted mt-0.5 group-hover:text-ccg-purple/70 transition-colors">
              View Products
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
