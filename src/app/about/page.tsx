import Link from "next/link";
import { Scribble } from "@/components/Scribble";

export const metadata = { title: "About · Atulya Arya" };

// First-draft copy, written only from facts Atulya has shared. Edit freely.
const loves = [
  "Introspection and noticing how I feel",
  "Team dynamics",
  "How AI is changing what we do",
  "Childhood memories",
  "General knowledge",
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-14 px-5 pb-24 pt-10 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-ink/30 pb-8">
        <span className="label text-ink-soft">Hello!</span>
        <h1 className="display text-[clamp(4rem,12vw,9rem)] text-red">About</h1>
      </header>

      <section className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5 text-xl leading-relaxed">
          <p>
            I&rsquo;m <strong className="text-red-deep">Atulya</strong>, a backend engineer (SDE 2) in fintech, moving
            towards client-facing technical roles and AI.
          </p>
          <p>
            I want my work to show a balance of analytical and creative. So I paint in acrylic, mostly nature and
            women, because it relaxes me. Dance and fitness are part of my life too.
          </p>
          <p>
            This site is my portfolio and my logbook: what I read, paint, learn and think, updated about once a week.
          </p>
        </div>
        <aside className="taped self-start px-7 pb-8 pt-10">
          <h2 className="label text-ink-soft">Things I love talking about</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {loves.map((item) => (
              <li key={item} className="pill w-fit">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <p className="label text-ink-soft">
        Read the rest in{" "}
        <Link href="/currently" className="underline underline-offset-4 hover:text-red-deep">
          <Scribble>Currently</Scribble>
        </Link>
        .
      </p>
    </main>
  );
}
