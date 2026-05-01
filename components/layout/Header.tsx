"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import TransitionLink from "@/components/ui/TransitionLink";
import SearchOverlay from "@/components/ui/SearchOverlay";

const leftLinks = [
  { href: "/catalog", label: "Collection" },
  { href: "/chat", label: "AI Stylist" },
];

const rightLinks = [
  { href: "/weather", label: "Weather" },
];

export default function Header() {
  const pathname = usePathname();
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const linkClass = (href: string) =>
    `nav-link text-[12px] tracking-[0.2em] uppercase transition-colors duration-300 ${
      pathname === href
        ? "text-white active"
        : "text-white/35 hover:text-white/80"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6 py-4"
            : "bg-transparent py-7"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-8 lg:px-12 flex items-center justify-between">

          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            {leftLinks.map(({ href, label }) => (
              <TransitionLink key={href} href={href} className={linkClass(href)}>
                {label}
              </TransitionLink>
            ))}
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.25em] uppercase text-white/80 hover:text-white transition-colors duration-300 mx-auto lg:mx-0"
          >
            Styleflow
          </Link>

          {/* Right nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {rightLinks.map(({ href, label }) => (
              <TransitionLink key={href} href={href} className={linkClass(href)}>
                {label}
              </TransitionLink>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              className="text-[12px] uppercase tracking-[0.2em] text-white/35 hover:text-white/80 transition-colors duration-300"
            >
              Search
            </button>

            {items.length > 0 && (
              <TransitionLink href="/order" className={linkClass("/order")}>
                Bag&nbsp;({items.length})
              </TransitionLink>
            )}
          </nav>

          {/* Mobile: search + burger */}
          <div className="flex lg:hidden items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[12px] uppercase tracking-[0.2em] text-white/35 hover:text-white/80 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="relative flex flex-col justify-center items-center w-5 h-5 gap-[5px]"
            >
              <span className={`block h-px bg-white/60 transition-all duration-300 origin-center ${menuOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"}`} />
              <span className={`block h-px bg-white/60 transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-3.5"}`} />
              <span className={`block h-px bg-white/60 transition-all duration-300 origin-center ${menuOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
              {items.length > 0 && !menuOpen && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-[7px] text-zinc-900 font-semibold leading-none">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col px-8 py-6 transition-all duration-400 lg:hidden ${
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex items-center justify-between mb-16">
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-serif text-lg tracking-[0.25em] uppercase text-white/80">
            Styleflow
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-white/30 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col flex-1">
          {[...leftLinks, ...rightLinks].map(({ href, label }, i) => (
            <TransitionLink
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`font-serif text-5xl font-light py-5 border-b border-white/6 transition-colors ${
                pathname === href ? "text-white" : "text-white/25 hover:text-white/70"
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
            >
              {label}
            </TransitionLink>
          ))}
        </nav>

        {items.length > 0 && (
          <TransitionLink
            href="/order"
            onClick={() => setMenuOpen(false)}
            className="mt-8 text-[10px] uppercase tracking-[0.25em] text-white/30 hover:text-white/70 transition-colors"
          >
            Bag ({items.length})
          </TransitionLink>
        )}
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
