'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import AudienceEmptyState from '@/components/AudienceEmptyState';
import { useAudience } from '@/components/AudienceProvider';
import type { CareerRole } from '@/lib/schema';

export default function CareerRolesList({ roles }: { roles: CareerRole[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const { audience, selectAudience } = useAudience();

  const availableAudiences = useMemo(
    () => Array.from(new Set(roles.flatMap((role) => role.audiences))),
    [roles]
  );
  const audienceRoles = useMemo(() => roles.filter((role) => role.audiences.includes(audience)), [roles, audience]);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    audienceRoles.forEach((role) => {
      role.tags.forEach((tag) => tags.add(tag));
      role.related_terms.forEach((term) => tags.add(term));
    });
    return Array.from(tags).sort();
  }, [audienceRoles]);

  const filteredRoles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = audienceRoles.filter((role) =>
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
  }, [audienceRoles, query, selectedTag, sort]);

  if (audienceRoles.length === 0) {
    return (
      <AudienceEmptyState
        audience={audience}
        available={availableAudiences}
        onSelect={selectAudience}
        sectionLabel="직무맵"
      />
    );
  }

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

      {filteredRoles.length === 0 ? (
        <p className="muted">조건에 맞는 직무가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredRoles.map((role) => (
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
