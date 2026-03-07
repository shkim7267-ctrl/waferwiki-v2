'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { CareerQuestion } from '@/lib/schema';

export default function CareerQuestionsList({ questions }: { questions: CareerQuestion[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach((question) => question.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = questions.filter((question) => (selectedTag ? question.tags.includes(selectedTag) : true));
    if (normalized) {
      filtered = filtered.filter((question) =>
        [question.title, question.intent_one_line, ...question.tags].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [questions, query, selectedTag, sort]);

  const visibleQuestions = useMemo(() => {
    return filteredQuestions.filter((question) => {
      const bodyLength = question.body ? question.body.replace(/\s+/g, '').length : 0;
      const isPlaceholderTitle = question.title.includes('중요한 포인트');
      const isGenericIntent = question.intent_one_line.includes('경험 기반으로 문제 해결 접근을 확인한다');
      if (isPlaceholderTitle && isGenericIntent && bodyLength < 80) return false;
      return true;
    });
  }, [filteredQuestions]);

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
        placeholder="면접 질문 검색"
      />

      {visibleQuestions.length === 0 ? (
        <div className="card border-accent-100 bg-accent-100/40">
          <p className="text-sm text-ink-700">콘텐츠 보강 중입니다. 다른 섹션을 먼저 확인해 주세요.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {visibleQuestions.map((question) => (
            <Link
              key={question.slug}
              href={`/career/questions/${question.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{question.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                {question.intent_one_line}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {question.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
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
