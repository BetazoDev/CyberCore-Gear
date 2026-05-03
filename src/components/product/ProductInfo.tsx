"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Loader2, Minus, Plus, Star, CheckCircle, Truck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

interface ProductAttribute { name: string; options?: string[]; }
interface Product {
  id: string; databaseId: number; name: string;
  shortDescription?: string; price: string; regularPrice?: string;
  salePrice?: string; onSale?: boolean; averageRating?: number;
  reviewCount?: number; stockStatus?: string;
  productCategories?: { nodes: { name: string; slug: string }[] };
  attributes?: { nodes: ProductAttribute[] };
}
interface Props { product: Record<string, unknown>; }

async function addToCartFetch(productId: number, quantity: number) {
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
  const wooToken = typeof window !== "undefined" ? localStorage.getItem("woo-session-token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (wooToken) headers["woocommerce-session"] = `Session ${wooToken}`;
  const query = `mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cartItem { key quantity product { node { id name } } }
    }
  }`;
  const res = await fetch(WP_URL, { method: "POST", headers, body: JSON.stringify({ query, variables: { productId, quantity } }) });
  const token = res.headers.get("woocommerce-session");
  if (token && typeof window !== "undefined") localStorage.setItem("woo-session-token", token);
  return res.json();
}

export default function ProductInfo({ product }: Props) {
  const p = product as unknown as Product;
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { openCart } = useCartStore();

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addToCartFetch(p.databaseId, qty);
      setAddedFeedback(true);
      openCart();
      setTimeout(() => setAddedFeedback(false), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const isOutOfStock = p.stockStatus === "OUT_OF_STOCK";

  return (
    <div className="space-y-6">
      {/* Category */}
      {p.productCategories?.nodes[0] && (
        <span className="inline-block text-[10px] uppercase tracking-[0.15em] text-ccg-purple border border-ccg-purple/30 bg-ccg-purple-light rounded-full px-3 py-1 font-semibold">
          {p.productCategories.nodes[0].name}
        </span>
      )}

      {/* Name */}
      <h1 className="font-russo text-3xl md:text-4xl text-ccg-black leading-tight">{p.name}</h1>

      {/* Rating */}
      {p.averageRating && p.averageRating > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(p.averageRating!) ? "text-ccg-purple fill-ccg-purple" : "text-ccg-border"}`} />
            ))}
          </div>
          <span className="text-ccg-muted text-sm">{p.averageRating.toFixed(1)} ({p.reviewCount} reviews)</span>
        </div>
      ) : null}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-russo text-4xl text-ccg-purple" style={{ textShadow: "0 0 15px rgba(124,58,237,0.2)" }}>
          {p.salePrice || p.price}
        </span>
        {p.onSale && p.regularPrice && (
          <span className="text-ccg-muted text-lg line-through">{p.regularPrice}</span>
        )}
      </div>

      {/* Description */}
      {p.shortDescription && (
        <div className="text-ccg-muted text-sm leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4"
          dangerouslySetInnerHTML={{ __html: p.shortDescription }} />
      )}

      {/* Attributes */}
      {p.attributes?.nodes && p.attributes.nodes.length > 0 && (
        <div className="space-y-4">
          {p.attributes.nodes.map(attr => (
            <div key={attr.name}>
              <p className="text-ccg-black text-sm font-semibold mb-2">{attr.name}</p>
              <div className="flex flex-wrap gap-2">
                {attr.options?.map(opt => (
                  <button key={opt}
                    className="px-4 py-2 rounded-lg border border-ccg-border text-sm font-medium cursor-pointer transition-all duration-200 text-ccg-muted hover:border-ccg-purple/50 hover:text-ccg-purple hover:bg-ccg-purple-light bg-white">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Qty + Add to Cart */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-ccg-border rounded-xl bg-white overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q-1))}
              className="p-3 text-ccg-muted hover:text-ccg-purple hover:bg-ccg-purple-light transition-all duration-200 cursor-pointer" aria-label="Decrease">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-5 py-3 text-ccg-black font-medium text-sm min-w-[48px] text-center border-x border-ccg-border">{qty}</span>
            <button onClick={() => setQty(q => q+1)}
              className="p-3 text-ccg-muted hover:text-ccg-purple hover:bg-ccg-purple-light transition-all duration-200 cursor-pointer" aria-label="Increase">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button className="p-3 border border-ccg-border rounded-xl text-ccg-muted hover:text-red-400 hover:border-red-200 hover:bg-red-50 transition-all duration-200 cursor-pointer" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          disabled={loading || isOutOfStock}
          className="w-full bg-ccg-purple hover:bg-ccg-purple-dark text-white font-semibold py-4 rounded-xl
                     flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer text-base
                     shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" />
            : addedFeedback ? <><CheckCircle className="w-5 h-5" /> Added to Cart!</>
            : isOutOfStock ? "Out of Stock"
            : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
        </motion.button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-ccg-border">
        {[
          { Icon: Truck, label: "Free shipping +$1,500 MXN" },
          { Icon: Shield, label: "1 Year Warranty" },
          { Icon: CheckCircle, label: "Authentic products" },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-ccg-muted text-xs">
            <Icon className="w-3.5 h-3.5 text-ccg-purple flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
