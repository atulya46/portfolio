"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutPage, sectionHref, sections } from "@/lib/site";
import { Scribble } from "./Scribble";

// Client component only because it needs the current URL to circle the active section.
export function SiteHeader() {
  const pathname = usePathname();
  const current = pathname.split("/")[1];

  return (
    <header className="relative z-10 flex items-center justify-between gap-6 px-5 py-5 sm:px-8">
      <Link href="/" className="display text-3xl text-red" aria-label="Atulya Arya, home">
        atulya<span className="text-ink">.</span>
      </Link>
      <nav aria-label="Sections">
        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <Link href={aboutPage.href} className="label text-ink hover:text-red-deep">
              <Scribble on={current === "about"}>{aboutPage.title}</Scribble>
            </Link>
          </li>
          {sections.map((s) => (
            <li key={s.slug}>
              <Link href={sectionHref(s.slug)} className="label text-ink hover:text-red-deep">
                <Scribble on={current === s.slug}>{s.title}</Scribble>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#index" className="label text-ink md:hidden">
          <Scribble>Index</Scribble>
        </Link>
      </nav>
    </header>
  );
}
