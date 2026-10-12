import { notFound, redirect } from "next/navigation";
import { sections } from "@/lib/site";

// Sections live on the home page now; an old /studio-style link lands on its anchor.
export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

export default async function SectionRedirect({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (!sections.some((s) => s.slug === section)) notFound();
  redirect(`/#${section}`);
}
