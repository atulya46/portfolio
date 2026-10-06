// About: the "Who I am" reference rebuilt in the site's own palette and type. A huge
// tone-on-tone title, a solid text block under it, and a cutout of me overlapping the title.
// The cutout is a sample; replace public/about/cutout-sample.svg (or change the path below).
const CUTOUT = "/about/cutout-sample.svg";

const loves = [
  "Introspection and noticing how I feel",
  "Team dynamics",
  "How AI is changing what we do",
  "Childhood memories",
  "General knowledge",
];

export function AboutRedesign() {
  return (
    <main className="about-stage">
      <h1 className="display about-title">About</h1>

      <div className="about-box">
        <p>
          I&rsquo;m Atulya, a backend engineer (SDE 2) in fintech, moving towards client-facing technical roles and AI.
        </p>
        <p>
          I want my work to show a balance of analytical and creative. So I paint in acrylic, mostly nature and women,
          because it relaxes me. Dance and fitness are part of my life too.
        </p>
        <p>This site is my portfolio and my logbook, updated about once a week.</p>
        <ul className="about-loves" aria-label="Things I love talking about">
          {loves.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Decorative cutout: the page makes sense without it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-cutout" src={CUTOUT} alt="" />
    </main>
  );
}
