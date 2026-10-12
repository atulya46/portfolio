"use client";

import { useEffect, useRef, useState } from "react";
import type { Section } from "@/lib/site";
import { ResumeLink } from "./ResumeLink";
import { ThemeToggle } from "./ThemeToggle";

// The pill menu. It sits under the hero, then sticks to the top of the window as you scroll.
// Clicking a pill scrolls the page to that section (the browser does the scrolling, so it also
// works without JS); the pill for the section you're reading is highlighted. The resume button and theme toggle live here too.
export function SectionNav({ sections, resume }: { sections: Section[]; resume?: string }) {
  const [active, setActive] = useState<string | null>(null);
  // Set while a click-triggered scroll is in flight, so the sections the page passes on the way
  // don't flash their pills; the clicked pill is already highlighted.
  const lockedRef = useRef(false);

  useEffect(() => {
    let unlockTimer: ReturnType<typeof setTimeout> | undefined;
    const unlock = () => {
      clearTimeout(unlockTimer);
      lockedRef.current = false;
      update();
    };
    // A manual scroll takes over from the click.
    const interrupt = () => {
      if (lockedRef.current) unlock();
    };

    function update() {
      if (lockedRef.current) return;
      const navHeight = document.getElementById("section-nav")?.offsetHeight ?? 0;
      // The active section is the last one whose top has reached just under the sticky menu.
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.slug);
        if (el && el.getBoundingClientRect().top <= navHeight + 2) current = s.slug;
      }
      // At the very bottom the last section may be too short to reach the menu.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].slug;
      }
      setActive(current);
    }

    const onClickNav = () => {
      lockedRef.current = true;
      clearTimeout(unlockTimer);
      // Safety net for browsers without the scrollend event.
      unlockTimer = setTimeout(unlock, 1500);
    };
    const nav = document.getElementById("section-nav");
    nav?.addEventListener("click", onClickNav);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scrollend", unlock);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(unlockTimer);
      nav?.removeEventListener("click", onClickNav);
      window.removeEventListener("scroll", update);
      window.removeEventListener("scrollend", unlock);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchmove", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <nav
      id="section-nav"
      aria-label="Sections"
      className="sticky top-0 z-10 h-[var(--nav-h)] border-b border-accent/15 bg-background/85 backdrop-blur"
    >
      <div className="mx-auto flex h-full max-w-5xl items-center gap-3 px-6 sm:px-8">
        <ul className="no-scrollbar flex flex-1 gap-2 overflow-x-auto py-1">
          {sections.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a
                href={`#${s.slug}`}
                title={s.blurb}
                onClick={() => setActive(s.slug)}
                aria-current={active === s.slug ? "true" : undefined}
                className="inline-block rounded-full border border-accent/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:border-accent hover:bg-accent hover:text-background active:scale-95 aria-[current=true]:border-accent aria-[current=true]:bg-accent aria-[current=true]:text-background"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        {resume && <ResumeLink href={resume} />}
        <ThemeToggle />
      </div>
    </nav>
  );
}
