'use client';

import { useEffect, useState } from 'react';
import type { LearningPath } from '@/lib/schema';

const storageKey = (slug: string) => `waferwiki.learn.path.${slug}`;

type ProgressState = Record<string, boolean>;

type ProgressSummary = {
  slug: string;
  title: string;
  percent: number;
};

export default function LearnProgressWidget({ paths }: { paths: LearningPath[] }) {
  const [summaries, setSummaries] = useState<ProgressSummary[]>([]);

  useEffect(() => {
    const next = paths.map((path) => {
      const raw = localStorage.getItem(storageKey(path.slug));
      let state: ProgressState = {};
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') state = parsed as ProgressState;
        } catch {
          state = {};
        }
      }
      const total = path.steps.length;
      const completed = path.steps.filter((step) => state[step.id]).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { slug: path.slug, title: path.title, percent };
    });
    setSummaries(next);
  }, [paths]);

  return (
    <div className="card space-y-3">
      <h2 className="section-title">진행률 요약</h2>
      <div className="space-y-2">
        {summaries.map((summary) => (
          <div key={summary.slug} className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-900">{summary.title}</span>
            <span className="text-ink-600">{summary.percent}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-500">진행률은 이 브라우저의 로컬 저장소에 저장됩니다.</p>
    </div>
  );
}
