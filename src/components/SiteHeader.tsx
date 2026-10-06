"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutPage, sectionHref, sections } from "@/lib/site";
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
  const onHero = pathname === "/";

  return (
    <header
      className={`relative z-10 flex items-center justify-between gap-6 px-5 py-6 sm:px-10 ${
        onHero ? "bg-red text-paper" : "text-ink"
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
    </header>
  );
}
