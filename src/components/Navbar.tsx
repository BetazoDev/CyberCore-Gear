"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X, Heart, Repeat, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/lib/store";

const DEFAULT_PROMOS = [
  "Enjoy free shipping on all orders this week! Shop Now →",
  "Save 20% on mechanical keyboards this month!",
  "New keycap sets available! Check them out."
];

interface NavbarProps {
  promos?: string[];
  logo?: string;
}

export default function Navbar({ promos = DEFAULT_PROMOS, logo }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);

  const [currentPromo, setCurrentPromo] = useState(0);

  const isHomepage = pathname === "/";
  // The navbar is transparent only on the homepage when at the top and not hovered
  const isTransparent = isHomepage && !scrolled && !isHovered && !mobileOpen;

  useEffect(() => {
    // Promo slider timer
    const promoTimer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(promoTimer);
  }, [promos.length]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Check initial scroll position
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = isTransparent ? "text-white hover:text-white/80" : "text-ccg-muted hover:text-ccg-black";
  const logoColor = isTransparent ? "text-white" : "text-ccg-black";
  const iconColor = isTransparent ? "text-white hover:text-white/80" : "text-ccg-black hover:text-ccg-purple";

  // Mock data for mega menu (based on Fynode reference)
  const MEGA_MENU = [
    {
      title: "Shop Lists",
      links: ["Shop Default", "Shop Right Sidebar", "Shop Wide", "Filters Area", "List Left Sidebar", "Load More Button", "Infinite Scrolling"],
    },
    {
      title: "Product Detail",
      links: ["Product Default", "Product Variable", "Product Grouped", "Product External", "Product Downloadable", "Product Zoom Image", "Product With Video"],
    },
    {
      title: "Product Features",
      links: ["Buy Now Button", "Order on WhatsApp", "Stock Progress Bar", "Sale Countdown", "Sticky Add to Cart", "Sticky Tab Titles", "Reviews Without Tab"],
    },
    {
      title: "Shop Pages",
      links: ["Cart", "Checkout", "My account", "Wishlist", "Compare", "Order Tracking", "Catalog Mode"],
    },
  ];

  return (
    <>
      {/* ── Top Announcement Bar (From Customizer) ─────────────── */}
      <div className="bg-ccg-black text-white py-2.5 px-4 text-xs flex justify-between items-center z-50 relative border-b border-white/10">
        <div className="hidden md:flex gap-6 text-white/70">
          <Link href="/tracking" className="hover:text-white transition-colors">Order Tracking</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>
        
        <div className="flex-1 flex justify-center items-center gap-4 text-center overflow-hidden">
          <button 
            onClick={() => setCurrentPromo(prev => prev === 0 ? promos.length - 1 : prev - 1)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="relative h-5 w-full max-w-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[11px] font-medium"
              >
                <span>
                  {promos[currentPromo].includes("Shop Now") ? (
                    <>
                      {promos[currentPromo].replace("Shop Now →", "")} 
                      <Link href="/catalog" className="font-semibold underline underline-offset-2 ml-1">Shop Now →</Link>
                    </>
                  ) : (
                    promos[currentPromo]
                  )}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setCurrentPromo(prev => (prev + 1) % promos.length)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="hidden md:flex gap-4 text-white/70">
          <button className="hover:text-white flex items-center gap-1">English <ChevronDown className="w-3 h-3" /></button>
          <button className="hover:text-white flex items-center gap-1">USD <ChevronDown className="w-3 h-3" /></button>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────── */}
      <motion.header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-[41px] left-0 right-0 z-40 w-full transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.05)] border-b border-ccg-border"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo (Supports WP Custom Logo) */}
          <Link href="/" className="flex items-center gap-2 group mr-8">
            {logo ? (
              <div className="relative h-10 w-40">
                <Image
                  src={logo}
                  alt="Site Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <span className={`font-russo text-2xl tracking-tight transition-colors ${logoColor}`}>
                <span className="text-ccg-purple mr-1">⚡</span>
                CyberCore
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-6 h-full flex-1">
            <li>
              <Link href="/" className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${pathname === "/" ? "text-ccg-purple" : textColor}`}>
                Home <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>
            </li>
            
            {/* Shop with Mega Menu */}
            <li 
              className="h-full flex items-center group/shop"
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
            >
              <Link href="/catalog" className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${pathname.startsWith("/catalog") ? "text-ccg-purple" : textColor}`}>
                Shop <ChevronDown className="w-3 h-3 opacity-50" />
              </Link>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {shopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-white border-b border-ccg-border shadow-2xl py-10 px-8 cursor-default"
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
                      {MEGA_MENU.map((col) => (
                        <div key={col.title}>
                          <h4 className="font-russo text-ccg-black text-sm mb-4">{col.title}</h4>
                          <ul className="space-y-2.5">
                            {col.links.map((link) => (
                              <li key={link}>
                                <Link href="/catalog" className="text-ccg-muted hover:text-ccg-purple text-sm transition-colors">
                                  {link}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <Link href="/catalog?category=teclados" className={`text-sm font-medium transition-colors cursor-pointer ${textColor}`}>
                Keyboards
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=custom" className={`text-sm font-medium transition-colors cursor-pointer ${textColor}`}>
                Custom
              </Link>
            </li>
            <li>
              <Link href="/blog" className={`text-sm font-medium transition-colors cursor-pointer ${textColor}`}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`text-sm font-medium transition-colors cursor-pointer ${textColor}`}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className={`transition-colors duration-200 cursor-pointer ${iconColor}`}>
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/account" aria-label="Account" className={`hidden sm:flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${iconColor}`}>
              <User className="w-5 h-5" />
              <span className="text-sm font-medium hidden xl:block">Account</span>
            </Link>

            <button aria-label="Wishlist" className={`hidden sm:flex items-center relative transition-colors duration-200 cursor-pointer ${iconColor}`}>
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ccg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>

            <button aria-label="Compare" className={`hidden sm:flex items-center transition-colors duration-200 cursor-pointer ${iconColor}`}>
              <Repeat className="w-5 h-5" />
            </button>

            <button
              aria-label={`Cart (${totalItems} items)`}
              onClick={toggleCart}
              className={`relative flex items-center transition-colors duration-200 cursor-pointer ${iconColor}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ccg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`transition-colors duration-200 cursor-pointer lg:hidden ${iconColor}`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-ccg-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Home</Link>
                <Link href="/catalog" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Shop</Link>
                <Link href="/catalog?category=teclados" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Keyboards</Link>
                <Link href="/catalog?category=custom" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Custom</Link>
                <Link href="/blog" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Blog</Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="block text-ccg-black font-medium">Contact</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
