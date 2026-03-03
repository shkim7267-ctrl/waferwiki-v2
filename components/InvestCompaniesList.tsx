'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import AudienceEmptyState from '@/components/AudienceEmptyState';
import { useAudience } from '@/components/AudienceProvider';
import type { InvestCompany } from '@/lib/schema';

export default function InvestCompaniesList({ companies }: { companies: InvestCompany[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const { audience, selectAudience } = useAudience();

  const availableAudiences = useMemo(
    () => Array.from(new Set(companies.flatMap((company) => company.audiences))),
    [companies]
  );
  const audienceCompanies = useMemo(
    () => companies.filter((company) => company.audiences.includes(audience)),
    [companies, audience]
  );

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    audienceCompanies.forEach((company) => {
      company.tags.forEach((tag) => tags.add(tag));
      company.positioning.forEach((item) => tags.add(item));
    });
    return Array.from(tags).sort();
  }, [audienceCompanies]);

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = audienceCompanies.filter((company) =>
      selectedTag ? company.tags.includes(selectedTag) || company.positioning.includes(selectedTag) : true
    );
    if (normalized) {
      filtered = filtered.filter((company) =>
        [company.title, ...company.positioning, ...company.tags].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [audienceCompanies, query, selectedTag, sort]);

  if (audienceCompanies.length === 0) {
    return (
      <AudienceEmptyState
        audience={audience}
        available={availableAudiences}
        onSelect={selectAudience}
        sectionLabel="회사 목록"
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
        placeholder="회사/포지셔닝 검색"
      />

      {filteredCompanies.length === 0 ? (
        <p className="muted">조건에 맞는 회사가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredCompanies.map((company) => (
            <Link
              key={company.slug}
              href={`/invest/companies/${company.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{company.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {company.positioning.slice(0, density === 'compact' ? 2 : 4).map((item) => (
                  <span key={item} className="rounded-full border border-ink-200/60 px-2 py-1">
                    {item}
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
