"use client";

import Link from "next/link";
import { Zap, AtSign, MessageSquare, PlayCircle, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "Teclados Mecánicos", href: "/catalog" },
    { label: "60% Layout", href: "/catalog?category=60" },
    { label: "TKL", href: "/catalog?category=tkl" },
    { label: "Full Size", href: "/catalog?category=full-size" },
    { label: "Accesorios", href: "/catalog?category=accesorios" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Contact", href: "/contact" },
    { label: "Warranty", href: "/warranty" },
  ],
  "About Us": [
    { label: "Our Story", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Affiliate Program", href: "/affiliates" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const SOCIAL = [
  { Icon: AtSign, href: "https://instagram.com", label: "Instagram" },
  { Icon: MessageSquare, href: "https://twitter.com", label: "Twitter / X" },
  { Icon: PlayCircle, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-ccg-charcoal border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-ccg-purple rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.5)]">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="font-russo text-xl text-white">
                Cyber<span className="text-ccg-purple-neon">Core</span> Gear
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Teclados mecánicos premium diseñados para quienes exigen lo mejor.
              Personalización sin límites.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white text-sm font-medium mb-2">Stay updated</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-lg placeholder-white/30 focus:border-ccg-purple focus:ring-1 focus:ring-ccg-purple/30 outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-ccg-purple hover:bg-ccg-purple-dark text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </form>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-ccg-purple-neon hover:border-ccg-purple/40 transition-all duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-ccg-purple-neon text-sm transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CyberCore Gear. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/30 text-xs">🔒 SSL Secured</span>
            <span className="text-white/30 text-xs">💳 Stripe · MercadoPago</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
