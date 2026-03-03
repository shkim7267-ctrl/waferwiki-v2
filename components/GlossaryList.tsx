'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ListToolbar from './ListToolbar';
import HighlightText from './HighlightText';
import { buildSearchIndex, searchDocs, type SearchDoc } from '@/lib/search';
import type {
  GlossaryEntry,
  Article,
  InvestTheme,
  InvestBrief,
  LearningPath,
  LearnConcept,
  LearnQuiz,
  CareerRole,
  CareerQuestion,
  CareerProject
} from '@/lib/schema';

export default function GlossaryList({
  glossary,
  articles,
  investThemes = [],
  investBriefs = [],
  learnPaths = [],
  learnConcepts = [],
  learnQuizzes = [],
  careerRoles = [],
  careerQuestions = [],
  careerProjects = []
}: {
  glossary: GlossaryEntry[];
  articles: Article[];
  investThemes?: InvestTheme[];
  investBriefs?: InvestBrief[];
  learnPaths?: LearningPath[];
  learnConcepts?: LearnConcept[];
  learnQuizzes?: LearnQuiz[];
  careerRoles?: CareerRole[];
  careerQuestions?: CareerQuestion[];
  careerProjects?: CareerProject[];
}) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sort, setSort] = useState<'alpha' | 'latest'>('alpha');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    glossary.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [glossary]);

  const docs = useMemo<SearchDoc[]>(
    () => [
      ...glossary.map((item) => ({
        id: `g-${item.slug}`,
        title: item.term,
        summary: item.one_line,
        tags: item.tags,
        audiences: item.audiences,
        type: 'glossary' as const,
        href: `/glossary/${item.slug}`
      })),
      ...articles.map((item) => ({
        id: `a-${item.slug}`,
        title: item.title,
        summary: item.summary_3lines?.[0] ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'article' as const,
        href: `/articles/${item.slug}`
      })),
      ...investThemes.map((item) => ({
        id: `it-${item.slug}`,
        title: item.title,
        summary: item.summary_3lines?.[0] ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'invest-theme' as const,
        href: `/invest/themes/${item.slug}`
      })),
      ...investBriefs.map((item) => ({
        id: `ib-${item.slug}`,
        title: item.title,
        summary: item.summary_3lines?.[0] ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'invest-brief' as const,
        href: `/invest/briefs/${item.slug}`
      })),
      ...learnPaths.map((item) => ({
        id: `lp-${item.slug}`,
        title: item.title,
        summary: item.steps?.[0]?.goal_one_line ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'learn-path' as const,
        href: `/learn/paths/${item.slug}`
      })),
      ...learnConcepts.map((item) => ({
        id: `lc-${item.slug}`,
        title: item.title,
        summary: item.one_line ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'learn-concept' as const,
        href: `/learn/concepts/${item.slug}`
      })),
      ...learnQuizzes.map((item) => ({
        id: `lq-${item.slug}`,
        title: item.title,
        summary: item.questions?.[0]?.q ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'learn-quiz' as const,
        href: `/learn/quiz/${item.slug}`
      })),
      ...careerRoles.map((item) => ({
        id: `cr-${item.slug}`,
        title: item.title,
        summary: item.one_line ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'career-role' as const,
        href: `/career/roles/${item.slug}`
      })),
      ...careerQuestions.map((item) => ({
        id: `cq-${item.slug}`,
        title: item.title,
        summary: item.intent_one_line ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'career-question' as const,
        href: `/career/questions/${item.slug}`
      })),
      ...careerProjects.map((item) => ({
        id: `cp-${item.slug}`,
        title: item.title,
        summary: item.goal_one_line ?? '',
        tags: item.tags,
        audiences: item.audiences,
        type: 'career-project' as const,
        href: `/career/projects/${item.slug}`
      }))
    ],
    [
      glossary,
      articles,
      investThemes,
      investBriefs,
      learnPaths,
      learnConcepts,
      learnQuizzes,
      careerRoles,
      careerQuestions,
      careerProjects
    ]
  );

  const { index, map } = useMemo(() => buildSearchIndex(docs), [docs]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchDocs(index, map, query);
  }, [index, map, query]);

  const filteredGlossary = useMemo(() => {
    const filtered = glossary
      .filter((item) => (selectedTag ? item.tags.includes(selectedTag) : true))
      .filter((item) => item.term.toLowerCase().includes(query.toLowerCase()) || !query.trim());

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'latest') return b.updated_at.localeCompare(a.updated_at);
      return a.term.localeCompare(b.term);
    });
    return sorted;
  }, [glossary, query, selectedTag, sort]);

  const cardClass = density === 'compact' ? 'card p-3' : 'card';
  const summaryClass = density === 'compact' ? 'mt-1 text-xs text-ink-600' : 'mt-1 text-sm text-ink-600';

  return (
    <div className="space-y-6">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        tagOptions={tagOptions}
        sort={sort}
        onSortChange={(value) => setSort(value as 'alpha' | 'latest')}
        density={density}
        onDensityChange={(value) => setDensity(value as 'comfortable' | 'compact')}
        sortOptions={[
          { value: 'alpha', label: '이름순' },
          { value: 'latest', label: '최신순' }
        ]}
        placeholder="Dictionary 또는 입문 글 검색"
      />

      {query.trim() ? (
        <div className="space-y-4">
          <h3 className="section-title">검색 결과</h3>
          {searchResults.length === 0 ? (
            <p className="muted">검색 결과가 없습니다.</p>
          ) : (
            <div className="grid gap-3">
              {searchResults.map((result) => (
                <Link key={result.id} href={result.href} className={cardClass}>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
                    {result.type === 'glossary'
                      ? 'Dictionary'
                      : result.type === 'article'
                      ? 'Article'
                      : result.type === 'invest-theme'
                      ? 'Invest Theme'
                      : result.type === 'invest-brief'
                      ? 'Invest Brief'
                      : result.type === 'learn-path'
                      ? 'Learn Path'
                      : result.type === 'learn-concept'
                      ? 'Learn Concept'
                      : result.type === 'learn-quiz'
                      ? 'Learn Quiz'
                      : result.type === 'career-role'
                      ? 'Career Role'
                      : result.type === 'career-question'
                      ? 'Career Question'
                      : 'Career Project'}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-ink-900">
                    <HighlightText text={result.title} query={query} />
                  </h4>
                  <p className={summaryClass}>
                    <HighlightText text={result.summary ?? ''} query={query} />
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-4">
        <h3 className="section-title">Dictionary 목록</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredGlossary.map((item) => (
            <Link key={item.slug} href={`/glossary/${item.slug}`} className={cardClass}>
              <h4 className="text-base font-semibold text-ink-900">{item.term}</h4>
              <p className={summaryClass}>{item.one_line}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                {item.tags.slice(0, density === 'compact' ? 2 : 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
