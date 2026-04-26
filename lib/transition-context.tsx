"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "in" | "out";

type Ctx = {
  trigger: (href: string) => void;
  phase: Phase;
};

const TransitionCtx = createContext<Ctx>({ trigger: () => {}, phase: "idle" });

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const router = useRouter();

  const trigger = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      setPhase("in");                        // панель въезжает (снизу → центр)
      setTimeout(() => {
        router.push(href);                   // меняем страницу под панелью
      }, 600);
      setTimeout(() => {
        setPhase("out");                     // панель уезжает (центр → вверх)
        setTimeout(() => setPhase("idle"), 700);
      }, 800);
    },
    [phase, router]
  );

  return (
    <TransitionCtx.Provider value={{ trigger, phase }}>
      {children}
    </TransitionCtx.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionCtx);
}
