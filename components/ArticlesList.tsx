'use client';

import { useMemo, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ListToolbar from '@/components/ListToolbar';
import AudienceEmptyState from '@/components/AudienceEmptyState';
import { useAudience } from '@/components/AudienceProvider';
import type { Article } from '@/lib/schema';

export default function ArticlesList({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const { audience, selectAudience } = useAudience();

  const availableAudiences = useMemo(
    () => Array.from(new Set(articles.flatMap((article) => article.audiences))),
    [articles]
  );

  const audienceArticles = useMemo(
    () => articles.filter((article) => article.audiences.includes(audience)),
    [articles, audience]
  );

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    audienceArticles.forEach((article) => article.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [audienceArticles]);

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = audienceArticles.filter((article) => (selectedTag ? article.tags.includes(selectedTag) : true));
    if (normalized) {
      filtered = filtered.filter((article) =>
        [article.title, ...(article.summary_3lines ?? [])].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [audienceArticles, query, selectedTag, sort]);

  if (audienceArticles.length === 0) {
    return (
      <AudienceEmptyState
        audience={audience}
        available={availableAudiences}
        onSelect={selectAudience}
        sectionLabel="입문용 글"
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
        placeholder="입문 글 검색"
      />

      {filteredArticles.length === 0 ? (
        <p className="muted">조건에 맞는 글이 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} density={density} />
          ))}
        </section>
      )}
    </div>
  );
}
