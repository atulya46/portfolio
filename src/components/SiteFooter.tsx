import { FooterLink, icon } from "./FooterLink";
import { SocialLinks } from "./SocialLinks";
import { contact } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-accent/15">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
        <SocialLinks />

        <FooterLink href={contact.feedback} label="Feedback">
          <svg {...icon}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Feedback
        </FooterLink>
      </div>
    </footer>
  );
}
