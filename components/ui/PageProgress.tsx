"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Старт анимации при смене страницы
    setVisible(true);
    setWidth(0);

    // Быстро до 30%, потом замедляемся до 85%
    let current = 0;
    const animate = () => {
      current += current < 30 ? 8 : current < 60 ? 3 : current < 80 ? 1 : 0.3;
      if (current > 85) current = 85;
      setWidth(current);
      if (current < 85) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    // Завершение — до 100% и скрытие
    timerRef.current = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setWidth(100);
      setTimeout(() => setVisible(false), 300);
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      <div
        className="h-full bg-zinc-900 transition-all duration-200 ease-out"
        style={{ width: `${width}%`, opacity: width === 100 ? 0 : 1 }}
      />
    </div>
  );
}
