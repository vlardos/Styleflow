"use client";
import { usePageTransition } from "@/lib/transition-context";
import React from "react";

export default function PageTransition() {
  const { phase } = usePageTransition();

  const transform =
    phase === "in"  ? "translateY(0)"     :
    phase === "out" ? "translateY(-102%)" :
    "translateY(104%)";

  const transition =
    phase === "idle"
      ? "none"
      : "transform 650ms cubic-bezier(0.76, 0, 0.24, 1)";

  const logoStyle: React.CSSProperties = phase === "in" ? {
    opacity: 1,
    letterSpacing: "0.35em",
    transition: "opacity 350ms ease, letter-spacing 700ms cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: "180ms",
  } : {
    opacity: 0,
    letterSpacing: "0.08em",
    transition: "opacity 150ms ease",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ transform, transition }}
    >
      {/* Main panel */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Grain texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top edge accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/12" />

      {/* Bottom edge accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/6" />

      {/* Center logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          className="font-serif text-white text-xl uppercase"
          style={logoStyle}
        >
          StyleFlow
        </span>
        {phase === "in" && (
          <span
            className="text-[8px] uppercase tracking-[0.4em] text-white/20"
            style={{ opacity: phase === "in" ? 1 : 0, transition: "opacity 300ms ease", transitionDelay: "350ms" }}
          >
            AI Fashion
          </span>
        )}
      </div>
    </div>
  );
}
