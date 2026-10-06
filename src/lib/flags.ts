// Feature flags. The section redesign (About, Currently, Studio) is an experiment:
// if it doesn't land, set NEXT_PUBLIC_SECTION_REDESIGN=off in Vercel and redeploy,
// or flip the default below. The old pages stay in the code until the experiment is accepted.
export const flags = {
  sectionRedesign: process.env.NEXT_PUBLIC_SECTION_REDESIGN !== "off",
};
