"use client";
import { usePageTransition } from "@/lib/transition-context";
import { usePathname } from "next/navigation";
import { CSSProperties, ReactNode, MouseEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

export default function TransitionLink({ href, children, className, onClick, style }: Props) {
  const { trigger } = usePageTransition();
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    // onClick вызываем в любом случае (например закрыть SearchOverlay)
    // но навигацию не запускаем если уже на этой странице
    if (pathname === href) { onClick?.(); return; }
    onClick?.();
    trigger(href);
  }

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
