'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { InvestTheme } from '@/lib/schema';

export default function InvestThemesList({ themes }: { themes: InvestTheme[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    themes.forEach((theme) => {
      theme.tags.forEach((tag) => tags.add(tag));
      theme.segments.forEach((segment) => tags.add(segment));
    });
    return Array.from(tags).sort();
  }, [themes]);

  const filteredThemes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = themes.filter((theme) =>
      selectedTag ? theme.tags.includes(selectedTag) || theme.segments.includes(selectedTag) : true
    );
    if (normalized) {
      filtered = filtered.filter((theme) =>
        [theme.title, ...(theme.summary_3lines ?? []), ...theme.segments].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [themes, query, selectedTag, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        tagOptions={tagOptions}
        sort={sort}
        onSortChange={(value) => setSort(value as 'latest' | 'title')}
        density={density}
        onDensityChange={(value) => setDensity(value as 'comfortable' | 'compact')}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'title', label: '이름순' }
        ]}
        placeholder="테마/기술 검색"
      />

      {filteredThemes.length === 0 ? (
        <p className="muted">조건에 맞는 테마가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredThemes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/invest/themes/${theme.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{theme.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {theme.summary_3lines[0]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {theme.segments.slice(0, density === 'compact' ? 2 : 4).map((segment) => (
                  <span key={segment} className="rounded-full border border-ink-200/60 px-2 py-1">
                    {segment}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
