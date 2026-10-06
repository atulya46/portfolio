"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { flags } from "@/lib/flags";
import { aboutPage, contact, sectionHref, sections } from "@/lib/site";
import { Scribble } from "./Scribble";

const links = [
  { href: aboutPage.href, title: aboutPage.title, slug: "about" },
  ...sections.map((s) => ({ href: sectionHref(s.slug), title: s.title, slug: s.slug })),
];

// Client component only because it needs the current URL: the homepage header sits on
// the rust hero (ivory text), every other page on ivory (deep-brown text).
export function SiteHeader() {
  const pathname = usePathname();
  const current = pathname.split("/")[1];
  const ref = useRef<HTMLElement>(null);

  // Publish the header height so the homepage hero can fill exactly the rest of the screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // "home": transparent, floating over the photo. true: solid rust (About). false: ivory pages.
  const onHero = pathname === "/" ? "home" : flags.sectionRedesign && pathname === "/about";

  return (
    <header
      ref={ref}
      className={`z-10 flex items-center justify-between gap-6 px-5 py-6 sm:px-10 ${
        onHero === "home" ? "absolute inset-x-0 top-0 text-paper" : onHero ? "relative bg-red text-paper" : "relative text-ink"
      }`}
    >
      <Link href="/" className="display text-2xl tracking-wide" aria-label="Atulya Arya, home">
        AA<span className="opacity-60">.</span>
      </Link>
      <nav aria-label="Sections">
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.slug}>
              <Link href={l.href} className="label opacity-90 hover:opacity-100">
                <Scribble on={current === l.slug}>{l.title}</Scribble>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#index" className="label md:hidden">
          <Scribble>Menu</Scribble>
        </Link>
      </nav>
      <a
        href={`mailto:${contact.email}`}
        className="btn label hidden !px-5 !py-2.5 hover:bg-current/10 lg:inline-flex"
      >
        Get in touch <span aria-hidden>&rarr;</span>
      </a>
    </header>
  );
}
