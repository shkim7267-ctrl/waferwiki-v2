'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { LearnConcept } from '@/lib/schema';

export default function LearnConceptsList({ concepts }: { concepts: LearnConcept[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    concepts.forEach((concept) => concept.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [concepts]);

  const filteredConcepts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = concepts.filter((concept) => (selectedTag ? concept.tags.includes(selectedTag) : true));
    if (normalized) {
      filtered = filtered.filter((concept) =>
        [concept.title, concept.one_line, ...concept.tags].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [concepts, query, selectedTag, sort]);

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
        placeholder="개념 카드 검색"
      />

      {filteredConcepts.length === 0 ? (
        <p className="muted">조건에 맞는 개념이 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredConcepts.map((concept) => (
            <Link
              key={concept.slug}
              href={`/learn/concepts/${concept.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{concept.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {concept.one_line}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {concept.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
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
