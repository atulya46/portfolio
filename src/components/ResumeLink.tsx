// A round button beside the theme toggle that opens the resume PDF in a new tab.
// The icon is a little page with a folded corner and a heart where the signature would be.
export function ResumeLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Resume (PDF, opens in a new tab)"
      title="Resume"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/40 text-foreground transition-colors duration-150 hover:border-accent hover:bg-accent hover:text-background active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 9h3M8 13h8" />
        <path d="M12 19.2l-1.6-1.5a1 1 0 0 1 1.6-1.2 1 1 0 0 1 1.6 1.2z" fill="currentColor" strokeWidth="1.2" />
      </svg>
    </a>
  );
}
