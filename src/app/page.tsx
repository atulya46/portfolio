import { sections, site } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-6 py-24">
      <div className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-widest text-muted">
          Under construction · paint still drying
        </p>
        <h1 className="text-5xl font-semibold tracking-tight">{site.name}</h1>
        <p className="max-w-xl text-lg text-muted">{site.tagline}</p>
      </div>
      <ul className="flex flex-wrap gap-3">
        {sections.map((s) => (
          <li key={s.slug}>
            <span
              title={`${s.blurb} (coming soon)`}
              className="inline-block rounded-full border border-accent/40 px-4 py-2 text-sm text-foreground"
            >
              {s.title}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
