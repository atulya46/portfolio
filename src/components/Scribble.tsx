import type { ReactNode } from "react";

// A thin underline that draws in when the surrounding link is hovered or focused,
// or stays drawn when `on` (the current page in the nav).
export function Scribble({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return (
    <span className="scribble" data-on={on}>
      {children}
    </span>
  );
}
