// A destination that is configured becomes a link; one that isn't stays as quiet plain text.
export function FooterLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const cls = "inline-flex items-center gap-2 text-sm";
  if (!href) {
    return (
      <span className={`${cls} text-muted/70`} title="Not set up yet">
        {children}
      </span>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${cls} transition-colors duration-150 hover:text-accent active:opacity-70`}
    >
      {children}
    </a>
  );
}

export const icon = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
