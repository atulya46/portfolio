"use client";

import { useEffect, useRef } from "react";

// Types its text one letter at a time, like someone at a keyboard, optionally with a blinking caret.
// It starts once the homepage intro has revealed the hero (or straight away when there is no intro).
// Pieces can be chained: give one a `name` and another `after={name}`, and the second waits for the
// first to finish. Screen readers get the whole text at once; with reduced motion the text simply appears.
// The full text sits invisibly underneath, so the layout doesn't shift while it types.
export function TypedText({
  text,
  startDelay = 250,
  caret = true,
  name,
  after,
}: {
  text: string;
  startDelay?: number;
  caret?: boolean;
  name?: string;
  after?: string;
}) {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typedRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = "";
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    const typeNext = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      // A human rhythm: mostly quick keystrokes, a little longer after a space.
      if (i < text.length) timer = setTimeout(typeNext, (text[i - 1] === " " ? 160 : 70) + Math.random() * 70);
      else if (name) window.dispatchEvent(new Event(`typed:${name}`));
    };
    const begin = () => (timer = setTimeout(typeNext, startDelay));
    const onPrevDone = () => begin();

    if (after) {
      window.addEventListener(`typed:${after}`, onPrevDone, { once: true });
      return () => {
        window.removeEventListener(`typed:${after}`, onPrevDone);
        clearTimeout(timer);
      };
    }
    const root = document.documentElement;
    if (root.dataset.intro !== "run") {
      begin();
      return () => clearTimeout(timer);
    }
    const watch = new MutationObserver(() => {
      if (root.dataset.intro !== "run") {
        watch.disconnect();
        begin();
      }
    });
    watch.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      watch.disconnect();
      clearTimeout(timer);
    };
  }, [text, startDelay, name, after]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-grid">
        <span className="invisible col-start-1 row-start-1">{text}</span>
        <span className="col-start-1 row-start-1">
          <span ref={typedRef}>{text}</span>
          {caret && <span className="typing-caret" />}
        </span>
      </span>
    </>
  );
}
