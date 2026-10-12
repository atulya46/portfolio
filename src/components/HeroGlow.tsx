"use client";

import { useEffect, useRef } from "react";
import { paintDots, setupCanvas, type DotCanvas } from "@/lib/dotGrid";

// How long a touched dot keeps glowing, and how far the glow reaches from the cursor.
const TRAIL_MS = 700;
const RADIUS = 120;
// Clicking darkens the trail at once; holding the button down deepens it further over this long.
const PRESS_MS = 600;

// The dot grid behind the hero (and the About section). Moving the cursor across it leaves a soft orange trail, as if a hand were
// brushing over the dots; the glow cools down behind it. The grid stays still for touch screens
// and when motion is reduced. Clicking or holding the button down turns the glow a darker orange.
export function HeroGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let c: DotCanvas | null = setupCanvas(canvas);
    // s is how hard the button was pressed when the point was left: 0 when just moving.
    const trail: { x: number; y: number; t: number; s: number }[] = [];
    let held: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    const strength = (now: number) => (held ? Math.min(1, 0.5 + (0.5 * (now - held.t)) / PRESS_MS) : 0);

    const draw = () => {
      if (!c) return;
      const now = performance.now();
      // While held still, keep feeding the spot so a long press keeps darkening it.
      if (held) trail.push({ x: held.x, y: held.y, t: now, s: strength(now) });
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
      const near = (x: number, y: number, p: { x: number; y: number; t: number }) => {
        const dx = x - p.x;
        const dy = y - p.y;
        if (Math.abs(dx) > RADIUS * 1.5 || Math.abs(dy) > RADIUS * 1.5) return 0;
        return (1 - (now - p.t) / TRAIL_MS) * Math.exp(-((dx * dx + dy * dy) / (RADIUS * RADIUS)) * 2);
      };
      paintDots(
        c,
        (x, y) => {
          let f = 0;
          for (const p of trail) f = Math.max(f, near(x, y, p));
          return f;
        },
        0.18,
        (x, y) => {
          let d = 0;
          for (const p of trail) if (p.s) d = Math.max(d, p.s * near(x, y, p));
          return d;
        },
      );
      raf = trail.length ? requestAnimationFrame(draw) : 0;
    };
    draw();

    const canGlow = matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const now = performance.now();
      if (held) held = { ...held, x, y };
      trail.push({ x, y, t: now, s: strength(now) });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (e.button !== 0 || x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      held = { x, y, t: performance.now() };
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onUp = () => (held = null);
    const onResize = () => {
      c = setupCanvas(canvas);
      draw();
    };
    // Repaint in the new colours when the theme toggle flips data-theme.
    const themeWatch = new MutationObserver(onResize);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (canGlow) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    }
    // Resize with its own box too, since a section can grow without the window changing size.
    const sizeWatch = new ResizeObserver(onResize);
    sizeWatch.observe(canvas);
    return () => {
      sizeWatch.disconnect();
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
