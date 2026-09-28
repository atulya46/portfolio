import type { ReactNode } from "react";

// A hand-drawn loop around its children, drawn in when the surrounding link is
// hovered or focused, or always when `on` (the current page in the nav).
export function Scribble({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return (
    <span className="scribble" data-on={on}>
      {children}
      <svg viewBox="0 0 130 46" preserveAspectRatio="none" aria-hidden="true">
        <path d="M14 20C18 7 86 2 114 13c16 7 10 23-28 28-36 5-78 1-80-15C4 13 30 6 58 5" />
      </svg>
    </span>
  );
}
