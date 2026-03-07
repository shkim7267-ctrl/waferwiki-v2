'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { CareerRole } from '@/lib/schema';

export default function CareerRolesList({ roles }: { roles: CareerRole[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    roles.forEach((role) => {
      role.tags.forEach((tag) => tags.add(tag));
      role.related_terms.forEach((term) => tags.add(term));
    });
    return Array.from(tags).sort();
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = roles.filter((role) =>
      selectedTag ? role.tags.includes(selectedTag) || role.related_terms.includes(selectedTag) : true
    );
    if (normalized) {
      filtered = filtered.filter((role) =>
        [role.title, role.one_line, ...role.tags, ...role.related_terms].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [roles, query, selectedTag, sort]);

  const visibleRoles = useMemo(() => {
    return filteredRoles.filter((role) => {
      const bodyLength = role.body ? role.body.replace(/\s+/g, '').length : 0;
      if (bodyLength < 80 && role.one_line.length < 20) return false;
      return true;
    });
  }, [filteredRoles]);

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
        placeholder="직무 검색"
      />

      {visibleRoles.length === 0 ? (
        <div className="card border-accent-100 bg-accent-100/40">
          <p className="text-sm text-ink-700">콘텐츠 보강 중입니다. 다른 섹션을 먼저 확인해 주세요.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {visibleRoles.map((role) => (
            <Link
              key={role.slug}
              href={`/career/roles/${role.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{role.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {role.one_line}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {role.related_terms.slice(0, density === 'compact' ? 2 : 4).map((term) => (
                  <span key={term} className="rounded-full border border-ink-200/60 px-2 py-1">
                    {term}
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
