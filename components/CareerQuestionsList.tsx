'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import AudienceEmptyState from '@/components/AudienceEmptyState';
import { useAudience } from '@/components/AudienceProvider';
import type { CareerQuestion } from '@/lib/schema';

export default function CareerQuestionsList({ questions }: { questions: CareerQuestion[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'latest' | 'title'>('latest');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const { audience, selectAudience } = useAudience();

  const availableAudiences = useMemo(
    () => Array.from(new Set(questions.flatMap((question) => question.audiences))),
    [questions]
  );
  const audienceQuestions = useMemo(
    () => questions.filter((question) => question.audiences.includes(audience)),
    [questions, audience]
  );

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    audienceQuestions.forEach((question) => question.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [audienceQuestions]);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = audienceQuestions.filter((question) => (selectedTag ? question.tags.includes(selectedTag) : true));
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
  }, [audienceQuestions, query, selectedTag, sort]);

  if (audienceQuestions.length === 0) {
    return (
      <AudienceEmptyState
        audience={audience}
        available={availableAudiences}
        onSelect={selectAudience}
        sectionLabel="면접 질문"
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
        placeholder="면접 질문 검색"
      />

      {filteredQuestions.length === 0 ? (
        <p className="muted">조건에 맞는 질문이 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredQuestions.map((question) => (
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
