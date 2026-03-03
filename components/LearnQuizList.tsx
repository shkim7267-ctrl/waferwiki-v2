'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from '@/components/ListToolbar';
import type { LearnQuiz } from '@/lib/schema';

export default function LearnQuizList({ quizzes }: { quizzes: LearnQuiz[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState<'title' | 'count'>('title');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    quizzes.forEach((quiz) => quiz.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let filtered = quizzes.filter((quiz) => (selectedTag ? quiz.tags.includes(selectedTag) : true));
    if (normalized) {
      filtered = filtered.filter((quiz) =>
        [quiz.title, ...quiz.tags].join(' ').toLowerCase().includes(normalized)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'count') return b.questions.length - a.questions.length;
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [quizzes, query, selectedTag, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        tagOptions={tagOptions}
        sort={sort}
        onSortChange={(value) => setSort(value as 'title' | 'count')}
        density={density}
        onDensityChange={(value) => setDensity(value as 'comfortable' | 'compact')}
        sortOptions={[
          { value: 'title', label: '이름순' },
          { value: 'count', label: '문항수' }
        ]}
        placeholder="퀴즈 검색"
      />

      {filteredQuizzes.length === 0 ? (
        <p className="muted">조건에 맞는 퀴즈가 없습니다.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredQuizzes.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/learn/quiz/${quiz.slug}`}
              className={`card hover:border-accent-500 ${density === 'compact' ? 'p-3' : ''}`}
            >
              <h2 className="section-title">{quiz.title}</h2>
              <p className={density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
                문항 {quiz.questions.length}개
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {quiz.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
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
