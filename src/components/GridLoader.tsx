"use client";

import { useEffect, useRef } from "react";
import { clamp, paintDots, setupCanvas } from "@/lib/dotGrid";

// Timeline, as a fraction of DURATION: the ripple crosses the grid in the first half, the
// percentage reaches 100 just before it leaves, and the hero text starts zooming in at REVEAL_AT.
const DURATION = 3000;
const REVEAL_AT = 0.34;

const glide = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x); // gentle start and finish

// An intro for the homepage: a grid of dots with a single soft ripple spreading from the centre to every
// edge, then the hero text zooms in. The inline script in layout.tsx decides whether it plays
// (homepage, motion allowed) by setting data-intro on <html>.
export function GridLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const c = canvasRef.current && root.dataset.intro === "run" ? setupCanvas(canvasRef.current) : null;
    if (!c) return;
    const cx = c.width / 2;
    const cy = c.height / 2;
    const maxR = Math.hypot(c.width, c.height) / 2 + 40;
    const band = 56;

    function draw(p: number) {
      // one glowing ring, easing out from the centre
      const r = maxR * glide(clamp(p / 0.55));
      paintDots(c!, (x, y) => {
        const d = Math.hypot(x - cx, (y - cy) * 1.3);
        const a = Math.atan2(y - cy, x - cx);
        const wobble = 10 * Math.sin(3 * a + p * 3); // a gentle wave so the ring isn't a perfect circle
        return Math.exp(-(((d + wobble - r) / band) ** 2));
      });
      if (pctRef.current) pctRef.current.textContent = `${Math.round(clamp(p / 0.52) * 100)}%`;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      draw(p);
      if (p >= REVEAL_AT && root.dataset.intro === "run") root.dataset.intro = "reveal";
      if (p < 1) raf = requestAnimationFrame(tick);
      else root.dataset.intro = "done";
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (root.dataset.intro !== "run") root.dataset.intro = "done";
    };
  }, []);

  return (
    <div className="grid-loader" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <span
        ref={pctRef}
        className="absolute right-5 bottom-5 rounded-full border border-foreground/10 bg-surface px-4 py-2 font-mono text-sm tabular-nums"
      >
        0%
      </span>
    </div>
  );
}
