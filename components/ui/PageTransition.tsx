"use client";
import { usePageTransition } from "@/lib/transition-context";

export default function PageTransition() {
  const { phase } = usePageTransition();

  // translateY: idle = 100% (за нижним краем), in = 0% (перекрывает экран), out = -100% (за верхним краем)
  const transform =
    phase === "in" ? "translateY(0)" :
    phase === "out" ? "translateY(-100%)" :
    "translateY(100%)";

  const transition =
    phase === "idle"
      ? "none"
      : "transform 600ms cubic-bezier(0.76, 0, 0.24, 1)";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-zinc-900 flex items-center justify-center pointer-events-none"
      style={{ transform, transition }}
    >
      <span
        className="font-serif text-white text-2xl tracking-[0.3em] uppercase"
        style={{
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity 200ms ease",
          transitionDelay: phase === "in" ? "200ms" : "0ms",
        }}
      >
        StyleFlow
      </span>
    </div>
  );
}
