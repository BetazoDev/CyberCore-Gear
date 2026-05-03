import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCTS } from "@/lib/queries";

interface Product {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  price: string;
  image?: { sourceUrl: string; altText: string };
}

export default async function PromoBanner() {
  // Fetch 2 featured products for the split promo (like Fynode's two-column promo cards)
  let products: Product[] = [];
  try {
    const client = await getClient();
    const { data } = await client.query({
      query: GET_PRODUCTS,
      variables: { first: 2 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products = (data as any)?.products?.nodes ?? [];
  } catch (e) {
    console.error("PromoBanner fetch error:", e);
  }

  const featuredProduct = products[0];
  const secondProduct = products[1];

  return (
    <>
      {/* ── Dark full-width promo banner (Fynode "Elevate" section) ── */}
      <section className="bg-ccg-black py-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-ccg-purple-neon font-medium mb-4 border border-ccg-purple/30 rounded-full px-3 py-1">
                Premium Standards
              </span>
              <h2 className="font-russo text-4xl md:text-5xl text-white leading-tight mb-4">
                Elevate Your{" "}
                <em className="not-italic" style={{ color: "#A855F7", textShadow: "0 0 25px rgba(168,85,247,0.5)" }}>
                  Typing Experience
                </em>{" "}
                <br />with CyberCore.
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
                Keyboards designed for style and performance. Every switch, every
                keystroke — crafted to perfection for your ultimate setup.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-white hover:bg-ccg-purple hover:text-white text-ccg-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Right: product image */}
            <div className="relative flex items-center justify-center min-h-[300px]">
              {/* Purple glow behind product */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-ccg-purple/20 rounded-full blur-3xl" />
              </div>
              {featuredProduct?.image?.sourceUrl ? (
                <div className="relative w-72 h-72">
                  <Image
                    src={featuredProduct.image.sourceUrl}
                    alt={featuredProduct.image.altText || featuredProduct.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="288px"
                  />
                </div>
              ) : (
                /* Keyboard mockup fallback */
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                  {[
                    [false, true, false, false, false],
                    [false, false, true, false, false, false, false, false, false, false, false, false],
                    [true, false, false, false, false, false, false, false, false, false, false],
                    [false, false, true, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false, false],
                  ].map((row, ri) => (
                    <div key={ri} className="flex gap-1.5 mb-1.5 justify-center">
                      {row.map((lit, ki) => (
                        <div
                          key={ki}
                          className={`h-8 rounded-md border ${lit ? "bg-ccg-purple/30 border-ccg-purple/60 shadow-[0_0_6px_rgba(124,58,237,0.4)]" : "bg-white/5 border-white/10"}`}
                          style={{ width: ri === 0 && ki === 0 ? 48 : 32 }}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <span className="text-white/30 text-xs">RGB Backlit</span>
                    <div className="flex gap-1">
                      {["#7C3AED", "#A855F7", "#C084FC", "#E9D5FF"].map((c) => (
                        <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 5px ${c}` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column split promo (Fynode "Where Innovation / Smart Solutions") ── */}
      <section className="bg-ccg-surface border-y border-ccg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ccg-border">
            {/* Left card */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 hover:bg-ccg-purple-light/30 transition-colors duration-300 group">
              <div className="flex-1">
                <p className="text-ccg-purple text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                  Unrivaled Precision
                </p>
                <h3 className="font-russo text-2xl text-ccg-black leading-tight mb-3 group-hover:text-ccg-purple transition-colors">
                  Where Innovation Meets Immersive Sound
                </h3>
                <p className="text-ccg-muted text-sm mb-4">Power meets precision in every detail.</p>
                <Link href="/catalog" className="inline-flex items-center gap-1.5 text-ccg-black font-semibold text-sm hover:text-ccg-purple transition-colors cursor-pointer group/link">
                  Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              {featuredProduct?.image?.sourceUrl && (
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={featuredProduct.image.sourceUrl}
                    alt={featuredProduct.name}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              )}
            </div>

            {/* Right card */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 hover:bg-ccg-purple-light/30 transition-colors duration-300 group">
              <div className="flex-1">
                <p className="text-ccg-purple text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                  Peak Perfection
                </p>
                <h3 className="font-russo text-2xl text-ccg-black leading-tight mb-3 group-hover:text-ccg-purple transition-colors">
                  Smart Solutions, Sleek Designs
                </h3>
                <p className="text-ccg-muted text-sm mb-4">Smart solutions for a connected world.</p>
                <Link href="/catalog" className="inline-flex items-center gap-1.5 text-ccg-black font-semibold text-sm hover:text-ccg-purple transition-colors cursor-pointer group/link">
                  Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              {secondProduct?.image?.sourceUrl && (
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={secondProduct.image.sourceUrl}
                    alt={secondProduct.name}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
