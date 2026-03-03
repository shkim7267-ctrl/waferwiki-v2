'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { RecentItem } from './RecentViewTracker';

const STORAGE_KEY = 'waferwiki.recent';
const SECTION_LIMIT = 5;

function loadItems(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export default function RecentViewList({
  section,
  title = '최근 본 콘텐츠'
}: {
  section: string;
  title?: string;
}) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = loadItems()
      .filter((item) => item.section === section)
      .sort((a, b) => b.viewed_at.localeCompare(a.viewed_at))
      .slice(0, SECTION_LIMIT);
    setItems(stored);
  }, [section]);

  return (
    <section className="card space-y-3">
      <h3 className="section-title">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-ink-600">아직 기록이 없습니다.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="rounded-lg border border-ink-200/60 px-3 py-2 text-sm">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500">{item.type}</div>
              <div className="mt-1 text-sm font-semibold text-ink-900">{item.title}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
