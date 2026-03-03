'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { CareerProject } from '@/lib/schema';

export default function CareerProjectsList({ projects }: { projects: CareerProject[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => project.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = projects.filter((project) => (selectedTag ? project.tags.includes(selectedTag) : true));
    if (normalized) {
      filtered = filtered.filter((project) =>
        [project.title, project.goal_one_line, ...project.tags].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [projects, query, selectedTag, sort]);

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
        placeholder="미니 프로젝트 검색"
      />

      {filteredProjects.length === 0 ? (
        <p className="muted">조건에 맞는 프로젝트가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/career/projects/${project.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{project.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {project.goal_one_line}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {project.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
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
