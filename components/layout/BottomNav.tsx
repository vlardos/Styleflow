"use client";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import TransitionLink from "@/components/ui/TransitionLink";

export default function BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors duration-300 ${
      isActive(href) ? "text-white" : "text-white/28"
    }`;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a]/96 backdrop-blur-md border-t border-white/8 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Home */}
      <TransitionLink href="/" className={linkClass("/")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span className="text-[9px] uppercase tracking-[0.15em]">Home</span>
      </TransitionLink>

      {/* Shop */}
      <TransitionLink href="/catalog" className={linkClass("/catalog")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span className="text-[9px] uppercase tracking-[0.15em]">Shop</span>
      </TransitionLink>

      {/* AI Stylist */}
      <TransitionLink href="/chat" className={linkClass("/chat")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span className="text-[9px] uppercase tracking-[0.15em]">Stylist</span>
      </TransitionLink>

      {/* Weather */}
      <TransitionLink href="/weather" className={linkClass("/weather")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="2" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span className="text-[9px] uppercase tracking-[0.15em]">Weather</span>
      </TransitionLink>

      {/* Bag */}
      <TransitionLink href="/order" className={linkClass("/order")}>
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 bg-white rounded-full flex items-center justify-center text-[8px] text-zinc-900 font-semibold leading-none">
              {items.length}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-[0.15em]">Bag</span>
      </TransitionLink>
    </nav>
  );
}
