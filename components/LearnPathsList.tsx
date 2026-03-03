'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import AudienceEmptyState from '@/components/AudienceEmptyState';
import { useAudience } from '@/components/AudienceProvider';
import type { LearningPath } from '@/lib/schema';

export default function LearnPathsList({ paths }: { paths: LearningPath[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const { audience, selectAudience } = useAudience();

  const availableAudiences = useMemo(
    () => Array.from(new Set(paths.flatMap((path) => path.audiences))),
    [paths]
  );
  const audiencePaths = useMemo(() => paths.filter((path) => path.audiences.includes(audience)), [paths, audience]);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    audiencePaths.forEach((path) => {
      path.tags.forEach((tag) => tags.add(tag));
      if (path.level) tags.add(path.level);
    });
    return Array.from(tags).sort();
  }, [audiencePaths]);

  const filteredPaths = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = audiencePaths.filter((path) =>
      selectedTag ? path.tags.includes(selectedTag) || path.level === selectedTag : true
    );
    if (normalized) {
      filtered = filtered.filter((path) =>
        [path.title, ...(path.steps?.map((step) => step.goal_one_line) ?? []), ...path.tags, path.level ?? '']
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
  }, [audiencePaths, query, selectedTag, sort]);

  if (audiencePaths.length === 0) {
    return (
      <AudienceEmptyState
        audience={audience}
        available={availableAudiences}
        onSelect={selectAudience}
        sectionLabel="학습 경로"
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
        placeholder="학습 경로 검색"
      />

      {filteredPaths.length === 0 ? (
        <p className="muted">조건에 맞는 경로가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredPaths.map((path) => (
            <Link
              key={path.slug}
              href={`/learn/paths/${path.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{path.level}</p>
              <h2 className="mt-2 text-base font-semibold text-ink-900">{path.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {path.steps[0]?.goal_one_line ?? '학습 목표를 준비 중입니다.'}
              </p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
