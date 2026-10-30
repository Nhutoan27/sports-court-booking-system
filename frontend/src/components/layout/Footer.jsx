import { Trophy } from 'lucide-react';

const LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Support', href: '#' },
  { label: 'Location', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-variant-2">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <span className="flex items-center gap-2 text-display-athletic text-base text-ink">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
            <Trophy className="size-3.5" />
          </span>
          NhuToan
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-ink-muted transition-colors hover:text-primary hover:underline">
              {link.label}
            </a>
          ))}
        </nav>

        <span className="text-sm text-ink-muted">© {new Date().getFullYear()} NhuToan Systems. All rights reserved.</span>
      </div>
    </footer>
  );
}

