"use client";
import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Чистим таймеры при размонтировании
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const trigger = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      // Сбрасываем предыдущие таймеры перед новым запуском
      timers.current.forEach(clearTimeout);
      timers.current = [];

      setPhase("in");
      timers.current.push(setTimeout(() => router.push(href), 600));
      timers.current.push(setTimeout(() => {
        setPhase("out");
        timers.current.push(setTimeout(() => setPhase("idle"), 700));
      }, 800));
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
