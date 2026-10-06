import Link from "next/link";
import { formatDate } from "./EntryCard";
import { loadEntries } from "@/lib/content/load";
import { contact } from "@/lib/site";

export function SiteFooter() {
  const latest = loadEntries()[0];

  return (
    <footer className="mt-auto bg-red text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <p className="display max-w-xl text-5xl sm:text-6xl">Thanks for scrolling this far.</p>
        <div className="label flex flex-col gap-2 leading-relaxed md:text-right">
          {latest && <span>Last entry · {formatDate(latest.date)}</span>}
          <span>Updated weekly-ish, painted daily-ish</span>
          <a href={`mailto:${contact.email}`} className="normal-case underline underline-offset-4 hover:text-ink">
            {contact.email}
          </a>
          <Link href={contact.linkedin} className="underline underline-offset-4 hover:text-ink">
            LinkedIn
          </Link>
          <Link href="https://github.com/atulya46/portfolio" className="underline underline-offset-4 hover:text-ink">
            Read the source on GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
