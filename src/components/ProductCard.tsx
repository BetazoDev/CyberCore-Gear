"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  galleryImages?: string[];
}

async function addToCartMutation(productId: number, quantity: number) {
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
  const wooToken =
    typeof window !== "undefined" ? localStorage.getItem("woo-session-token") : null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (wooToken) headers["woocommerce-session"] = `Session ${wooToken}`;

  const query = `
    mutation AddToCart($productId: Int!, $quantity: Int!) {
      addToCart(input: { productId: $productId, quantity: $quantity }) {
        cartItem { key quantity product { node { id name } } }
      }
    }
  `;

  const res = await fetch(WP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: { productId, quantity } }),
  });

  const sessionToken = res.headers.get("woocommerce-session");
  if (sessionToken && typeof window !== "undefined") {
    localStorage.setItem("woo-session-token", sessionToken);
  }
  return res.json();
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  regularPrice,
  salePrice,
  onSale,
  imageUrl,
  imageAlt,
  category,
  rating,
  reviewCount,
  galleryImages = [],
}: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { openCart } = useCartStore();

  const allImages = imageUrl ? [imageUrl, ...galleryImages] : galleryImages;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await addToCartMutation(id, 1);
      setAddedFeedback(true);
      openCart();
      setTimeout(() => setAddedFeedback(false), 2500);
    } catch (err) {
      console.error("AddToCart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const discountPct =
    onSale && regularPrice && salePrice
      ? Math.round(
          ((parseFloat(regularPrice.replace(/[^0-9.]/g, "")) -
            parseFloat(salePrice.replace(/[^0-9.]/g, ""))) /
            parseFloat(regularPrice.replace(/[^0-9.]/g, ""))) *
            100
        )
      : null;

  return (
    <Link href={`/product/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseEnter={() => allImages.length > 1 && setCurrentImage(1)}
        onMouseLeave={() => setCurrentImage(0)}
        className="group relative overflow-hidden rounded-2xl bg-white border border-ccg-border cursor-pointer
                   transition-all duration-300
                   hover:border-ccg-purple/40
                   hover:shadow-[0_8px_40px_rgba(124,58,237,0.12)]"
      >
        {/* ── Image Area ─────────────────────────────────── */}
        <div className="relative aspect-square overflow-hidden bg-ccg-surface">
          {allImages.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={allImages[currentImage]}
                  alt={imageAlt || name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-ccg-border" />
            </div>
          )}

          {/* Discount badge */}
          {(discountPct || onSale) && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="bg-ccg-purple text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                {discountPct ? `-${discountPct}%` : "SALE"}
              </span>
            </div>
          )}

          {/* Rating */}
          {rating && rating > 0 ? (
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 border border-ccg-border">
              <span className="text-ccg-purple text-[10px]">★</span>
              <span className="text-[10px] text-ccg-text font-medium">{rating.toFixed(1)}</span>
            </div>
          ) : null}

          {/* ── Add to Cart Overlay ─────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-ccg-black hover:bg-ccg-purple
                         text-white font-semibold py-3 text-sm
                         flex items-center justify-center gap-2
                         transition-all duration-200 cursor-pointer
                         disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label={`Add ${name} to cart`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : addedFeedback ? (
                <><CheckCircle className="w-4 h-4" /> Added!</>
              ) : (
                <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
              )}
            </button>
          </div>
        </div>

        {/* ── Product Info ─────────────────────────────── */}
        <div className="p-3.5 bg-white">
          {category && (
            <p className="text-ccg-purple text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">
              {category}
            </p>
          )}
          <h3 className="font-chakra font-semibold text-sm text-ccg-text leading-snug line-clamp-2 mb-2 group-hover:text-ccg-purple transition-colors duration-200">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-russo text-ccg-purple text-base">
              {salePrice || price}
            </span>
            {onSale && regularPrice && (
              <span className="text-ccg-muted text-xs line-through">{regularPrice}</span>
            )}
          </div>
          {reviewCount && reviewCount > 0 ? (
            <p className="text-ccg-muted text-[10px] mt-1">{reviewCount} reviews</p>
          ) : null}
        </div>
      </motion.div>
    </Link>
  );
}
