# Atulya's Portfolio

## Goal

Build a personal website that is both a portfolio and a personal tracker.

It should show who I am as a whole person: an engineer who thinks analytically and also paints, dances, reads, travels and reflects. Future employers (especially for Solutions Architect / Forward Deployed Engineer / AI-focused roles) should come away seeing someone technically capable, curious about AI, and genuinely creative. Anyone else who wants to know me should come away feeling they've met me.

It is also where I keep a record of what I read, paint, learn, watch and think, updated about once a week.

This is a learning project too, following the theme **learn as we build**: Claude builds, and after every milestone gives me a recap of what I should understand from it.

---

## Who This Site Is About

- Software engineer (SDE 2, backend, fintech). Moving towards client-facing technical roles and AI.
- Aspiring jack of all trades: I want my work to show a balance of technical/analytical acumen and creativity.
- Love talking about: introspection and awareness of feelings, team dynamics, how AI is changing what we do, childhood memories, general knowledge.
- Paint in acrylic, mostly nature and women. Painting relaxes me.
- Dance and fitness are part of my life.
- Influences: *The Woman in Me* (Britney Spears), MS Dhoni's off-radar way of living, a trip to Sikkim that stayed with me, Nolan's films, *Joker*, *Taare Zameen Par*.

What stays off the site: very private material (journal-level writing, family matters). Everything that is on the site is public; there are no private sections.

---

## Audience

1. Future employers and hiring managers.
2. Anyone who wants to know me.

The site should work for a recruiter who has 30 seconds, and for someone who wants to spend 20 minutes reading.

---

## Sections

| Section | What goes in it |
|---|---|
| **Work** | Projects and career highlights |
| **AI** | What I'm building, learning and thinking about in AI |
| **Learning** | Courses, what I learned, certificates |
| **Leisure** | Books, movies/series, travel |
| **Canvas** | Paintings |
| **Movement** | Dance and fitness |
| **Thoughts** | Opinions and introspective pieces |

Section names are working names and can change.

---

## Content Rhythm & Entry Style

- Updated roughly **weekly**. This is not an app I log into all day.
- Entries are usually **medium length**; sometimes long-form when I'm in the zone.
- Entries vary in shape. A book entry, for example, can be any mix of:
  - a brief take
  - a full reflection
  - quotes I loved
- The content model must allow that variety without forcing every field.

---

## Look & Feel

- **Feel:** warm, playful, creative, witty.
- **Colours:** warm tones. Not derived from my paintings.
- **Design references** (for mood, not to copy):
  - https://dribbble.com/shots/27517967-FoliBlox-Creative-Portfolio-Website-UI-Design
  - https://www.squarespace.com/websites/create-a-portfolio
  - https://www.behance.net/gallery/154020263/PORTFOLIO
  - https://onepagelove.com/tenztan
  - https://www.behance.net/gallery/234054163/PORTFOLIO-2025-EN
- Personality should come through in small details: microcopy, hover states, little surprises. Witty, never gimmicky.
- **Homepage:** to be decided later, once the sections and visual identity exist.
- Must work well on mobile.

---

## How We Split The Work

Claude drives. Claude makes all the changes (frontend, backend, content, config, deploy), milestone by milestone. I don't want to spend energy learning fullstack right now, and I want the site live soon.

My role:
- Make the decisions that shape the site (content, design direction, what goes live).
- Review each milestone's result on the live or preview site.
- Read the learning recap at the end of each milestone.

## Technology Choices

Recommended starting stack:

- **Next.js with TypeScript**: full-stack in one project, pages plus server-side routes.
- **Content as Markdown files with frontmatter**, stored in the repo. Weekly updates mean a database isn't needed yet. Adding an entry means adding a file.
- **Zod** for validating content (the TypeScript equivalent of Pydantic).
- **Vitest** for tests.
- **Git/GitHub**, deployed on **Vercel**.

Avoid initially:
- Databases, CMSs, auth
- Heavy UI component libraries
- State management libraries

Later, when we add AI:
- An "ask my portfolio" feature that answers questions using my own entries (RAG over my content).
- Whether this lives in Next.js or a small separate Python service is decided when we get there.

We only add technology when there is a clear reason.

---

## Development Philosophy

Prefer:
- simple code, explicit functions, clear names
- type hints everywhere
- small modules
- tests for important logic
- comments that explain WHY, not WHAT

Avoid:
- premature abstractions
- over-engineering
- clever code when simple code works

If there are several reasonable approaches, Claude recommends one and briefly explains the trade-off. If something is unnecessary, Claude says so.

---

## How Claude Should Work With Me

Work in milestones. Don't build everything at once, but keep each milestone moving without waiting on me for small calls: pick a sensible default, say which, and continue.

For each milestone:

1. **Plan.** Say briefly what this milestone builds and any decision I need to make.
2. **Build.** Claude writes the code and tests, and keeps them passing.
3. **Show.** Share a preview link or screenshots so I can see the result.
4. **Learning recap.** A short recap written for a backend engineer:
   - what was built and how the pieces fit together
   - the key concepts involved (Next.js, TypeScript, React, deployment, AI), explained briefly
   - the design decisions made and their trade-offs
   - where to look in the code if I want to go deeper
   No quiz. The recap is for reading, not homework.
5. Then the next milestone.

Recaps are saved in the repo under `docs/recaps/` so they build up into my own notes on how the site works.

## Milestones (draft)

Ordered to get the site live early, then grow it.

1. **Setup.** Repo, Next.js + TypeScript, Vitest, lint, first deploy to Vercel.
2. **Content model and pages.** Entry types and schemas (book, painting, course, trip, movie, project, thought, movement), loading and validating Markdown files, section and entry pages, with a few real entries of mine.
3. **Visual identity.** Colours, type, layout, components, the witty details. Homepage decided here.
4. **Launch.** SEO basics, performance, custom domain. The site goes public.
5. **Weekly publishing flow.** Make adding an entry fast (for example, a template or small script).
6. **AI.** "Ask my portfolio" over my own entries.

## First Milestone

Do NOT build the site yet. Instead:

1. Read this PROJECT.md.
2. Propose the project structure.
3. Set up the Next.js + TypeScript project.
4. Add Vitest with one passing sample test.
5. Add `.gitignore`, a minimal README, this PROJECT.md and `docs/recaps/`.
6. Push to GitHub and deploy the empty site to Vercel.

Then stop, share the live link, and give the learning recap.
