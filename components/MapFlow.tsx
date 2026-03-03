'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { recommendByTags } from '@/lib/recommend';
import type { Article, GlossaryEntry, MapStep } from '@/lib/schema';

export default function MapFlow({
  steps,
  glossary,
  articles
}: {
  steps: MapStep[];
  glossary: GlossaryEntry[];
  articles: Article[];
}) {
  const [activeSlug, setActiveSlug] = useState(steps[0]?.slug ?? '');

  const activeStep = useMemo(
    () => steps.find((step) => step.slug === activeSlug) ?? steps[0],
    [activeSlug, steps]
  );

  const bodyParagraphs = useMemo(() => {
    if (!activeStep?.body) return [];
    return activeStep.body
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [activeStep]);

  const relatedTerms = useMemo(() => {
    if (!activeStep) return [];
    return recommendByTags(glossary, activeStep.tags, activeStep.audiences, 5);
  }, [activeStep, glossary]);

  const relatedArticles = useMemo(() => {
    if (!activeStep) return [];
    return recommendByTags(articles, activeStep.tags, activeStep.audiences, 3);
  }, [activeStep, articles]);

  if (!activeStep) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-3">
        <h2 className="section-title">공정 흐름</h2>
        <div className="grid gap-2">
          {steps.map((step, index) => (
            <button
              key={step.slug}
              type="button"
              onClick={() => setActiveSlug(step.slug)}
              className={
                activeSlug === step.slug
                  ? 'rounded-xl border border-accent-500 bg-accent-100 px-4 py-3 text-left'
                  : 'rounded-xl border border-ink-200/60 bg-white px-4 py-3 text-left'
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-900">{step.step}</span>
                <span className="text-xs text-ink-500">{index + 1}</span>
              </div>
              <p className="mt-2 text-xs text-ink-600">{step.summary_3lines?.[0]}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">선택한 단계</p>
          <h3 className="mt-2 text-xl font-semibold text-ink-900">{activeStep.title}</h3>
          <ul className="mt-3 space-y-1 text-sm text-ink-600">
            {activeStep.summary_3lines.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>

        {bodyParagraphs.length > 0 ? (
          <div className="space-y-2 text-sm text-ink-600">
            {bodyParagraphs.map((paragraph, index) => (
              <p key={`${activeStep.slug}-body-${index}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {activeStep.key_points.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-ink-900">핵심 포인트</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-600">
              {activeStep.key_points.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeStep.common_issues.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-ink-900">문제/결함</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-600">
              {activeStep.common_issues.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeStep.measurements.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-ink-900">측정 포인트</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-600">
              {activeStep.measurements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeStep.handoff.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-ink-900">단계 연결</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-600">
              {activeStep.handoff.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <h4 className="text-sm font-semibold text-ink-900">관련 용어</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-600">
            {relatedTerms.length === 0 ? (
              <span className="muted">추천 용어가 없습니다.</span>
            ) : (
              relatedTerms.map((term) => (
                <Link key={term.slug} href={`/glossary/${term.slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
                  {term.term}
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">관련 글</h4>
          <div className="mt-2 space-y-2">
            {relatedArticles.length === 0 ? (
              <span className="muted">추천 글이 없습니다.</span>
            ) : (
              relatedArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="block rounded-lg border border-ink-200/60 px-3 py-2 text-sm text-ink-700">
                  {article.title}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
