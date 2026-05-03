"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, totalItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ccg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-ccg-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ccg-border">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-ccg-purple" />
                <h2 className="font-russo text-lg text-ccg-black">Cart</h2>
                {totalItems > 0 && (
                  <span className="text-xs bg-ccg-purple text-white font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 rounded-lg text-ccg-muted hover:text-ccg-black hover:bg-ccg-surface transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <div className="w-16 h-16 bg-ccg-purple-light rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-ccg-purple" />
                  </div>
                  <p className="font-russo text-ccg-black text-lg">Your cart is empty</p>
                  <p className="text-ccg-muted text-sm">Add some keyboards to get started.</p>
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="mt-2 inline-flex items-center gap-2 bg-ccg-purple hover:bg-ccg-purple-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-xl bg-ccg-surface border border-ccg-border"
                  >
                    <div className="w-14 h-14 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-ccg-border">
                      {item.product.node.image?.sourceUrl && (
                        <Image
                          src={item.product.node.image.sourceUrl}
                          alt={item.product.node.name}
                          width={56}
                          height={56}
                          className="object-contain w-full h-full p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ccg-black truncate">
                        {item.product.node.name}
                      </p>
                      <p className="text-xs text-ccg-muted mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-russo text-ccg-purple mt-1">{item.total}</p>
                    </div>
                    <button
                      aria-label="Remove item"
                      className="p-1.5 rounded-lg text-ccg-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-ccg-border px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-ccg-muted text-sm">Subtotal</span>
                  <span className="font-russo text-ccg-purple text-lg">{subtotal}</span>
                </div>
                <p className="text-ccg-muted text-xs">Shipping calculated at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-ccg-purple hover:bg-ccg-purple-dark text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] text-sm"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full border border-ccg-border text-ccg-muted hover:text-ccg-black hover:border-ccg-purple/30 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
