'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { InvestBrief } from '@/lib/schema';

export default function InvestBriefsList({ briefs }: { briefs: InvestBrief[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    briefs.forEach((brief) => {
      brief.tags.forEach((tag) => tags.add(tag));
      if (brief.period) tags.add(brief.period);
    });
    return Array.from(tags).sort();
  }, [briefs]);

  const filteredBriefs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = briefs.filter((brief) =>
      selectedTag ? brief.tags.includes(selectedTag) || brief.period === selectedTag : true
    );
    if (normalized) {
      filtered = filtered.filter((brief) =>
        [brief.title, ...(brief.summary_3lines ?? []), ...brief.tags, brief.period ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [briefs, query, selectedTag, sort]);

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
        placeholder="브리핑 검색"
      />

      {filteredBriefs.length === 0 ? (
        <p className="muted">조건에 맞는 브리핑이 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredBriefs.map((brief) => (
            <Link
              key={brief.slug}
              href={`/invest/briefs/${brief.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{brief.period}</p>
              <h2 className="mt-2 text-base font-semibold text-ink-900">{brief.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {brief.summary_3lines?.[0]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {brief.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
                    #{tag}
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
