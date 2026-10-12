"use client";

import { useEffect, useRef } from "react";

// How fast a column drifts, in pixels per second.
const SPEED = 38;

// A fixed-height column that slowly scrolls itself and loops forever. `reverse` drifts the other
// way, so neighbouring columns don't move in lockstep. It pauses while hovered, focused or touched
// and while off screen; visitors can scroll it with a wheel or trackpad, swipe it, or drag it with
// the mouse. It only moves when its items overflow, and never with reduced motion.
export function ColumnScroller({ children, label, reverse = false }: { children: React.ReactNode; label: string; reverse?: boolean }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLUListElement>(null);
  const cloneRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const view = viewRef.current;
    const first = firstRef.current;
    const clone = cloneRef.current;
    if (!view || !first || !clone) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let loop = 0; // height of one copy of the list; 0 when it fits and nothing moves
    let pos = 0;
    let paused = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    // The second copy of the list only exists to make the loop seamless, so it shows only when
    // the column actually overflows.
    const measure = () => {
      const overflows = !still && first.offsetHeight > view.clientHeight + 4;
      clone.style.display = overflows ? "" : "none";
      loop = overflows ? clone.offsetTop - first.offsetTop : 0;
      if (loop && reverse && pos === 0) pos = loop;
      view.scrollTop = pos;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) / 1000 : 0;
      last = now;
      if (loop && !paused && visible) {
        pos += (reverse ? -SPEED : SPEED) * dt;
        if (pos >= loop) pos -= loop;
        if (pos <= 0) pos += loop;
        view.scrollTop = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => (paused = true);
    const resume = () => {
      paused = false;
      pos = view.scrollTop; // carry on from wherever the visitor left it
    };
    const onScroll = () => {
      if (paused) pos = view.scrollTop;
    };

    // Mouse drag: move the column with the pointer, and swallow the click if it was a drag.
    let dragY: number | null = null;
    let dragTop = 0;
    let dragged = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragY = e.clientY;
      dragTop = view.scrollTop;
      dragged = false;
    };
    const onMove = (e: PointerEvent) => {
      if (dragY === null) return;
      const dy = e.clientY - dragY;
      if (Math.abs(dy) > 4) dragged = true;
      if (dragged) {
        e.preventDefault();
        view.scrollTop = dragTop - dy;
      }
    };
    const onUp = () => (dragY = null);
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(view);
    ro.observe(first);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.1 });
    io.observe(view);
    raf = requestAnimationFrame(tick);

    const events: [string, EventListener, AddEventListenerOptions?][] = [
      ["pointerenter", pause],
      ["pointerleave", resume],
      ["focusin", pause],
      ["focusout", resume],
      ["touchstart", pause, { passive: true }],
      ["touchend", resume, { passive: true }],
      ["scroll", onScroll, { passive: true }],
      ["pointerdown", onDown as EventListener],
      ["pointermove", onMove as EventListener],
      ["click", onClick as EventListener, { capture: true }],
      ["dragstart", ((e: Event) => e.preventDefault()) as EventListener],
    ];
    for (const [ev, fn, opts] of events) view.addEventListener(ev, fn, opts);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      for (const [ev, fn, opts] of events) view.removeEventListener(ev, fn, opts);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reverse]);

  const list = "flex flex-col gap-6 pb-6";
  return (
    <div
      ref={viewRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className="no-scrollbar h-[26rem] cursor-grab overflow-y-auto overscroll-contain border-y border-accent/20 pt-6 select-none active:cursor-grabbing md:h-[max(20rem,calc(100svh-25rem))]"
    >
      <ul ref={firstRef} className={list}>
        {children}
      </ul>
      <ul ref={cloneRef} aria-hidden="true" inert className={list} style={{ display: "none" }}>
        {children}
      </ul>
    </div>
  );
}
