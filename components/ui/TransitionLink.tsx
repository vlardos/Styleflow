"use client";
import { usePageTransition } from "@/lib/transition-context";
import { ReactNode, MouseEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function TransitionLink({ href, children, className, onClick }: Props) {
  const { trigger } = usePageTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // не перехватываем внешние ссылки и модификаторы
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    onClick?.();
    trigger(href);
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
