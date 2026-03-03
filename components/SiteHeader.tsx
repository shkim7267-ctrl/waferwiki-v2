'use client';

import Link from 'next/link';
import SearchModal from '@/components/SearchModal';
import type { SearchDoc } from '@/lib/search';

const navItems = [
  { label: 'Map', href: '/map' },
  { label: 'Dictionary', href: '/glossary' },
  { label: 'Articles', href: '/articles' },
  { label: 'Invest', href: '/invest' },
  { label: 'Learn', href: '/learn' },
  { label: 'Career', href: '/career' }
] as const;

const partnerLink = {
  label: 'Semibridge',
  href: 'https://semibridge.pages.dev'
};

export default function SiteHeader({ docs }: { docs: SearchDoc[] }) {
  return (
    <header className="border-b border-ink-200/60 bg-white/80 backdrop-blur">
      <div className="container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
            WaferWiki v2
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-3 py-1 hover:border-ink-200/60 hover:bg-ink-200/20"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchModal docs={docs} />
          <a
            href={partnerLink.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent-600 px-3 py-1 text-xs font-medium text-white"
          >
            {partnerLink.label}
          </a>
        </div>
      </div>
    </header>
  );
}
