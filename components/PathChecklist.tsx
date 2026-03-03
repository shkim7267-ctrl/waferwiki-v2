'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LearnPathStep } from '@/lib/schema';

const storageKey = (slug: string) => `waferwiki.learn.path.${slug}`;

type ProgressState = Record<string, boolean>;

type StepResourceLink = { title: string; href: string };
type StepResources = Record<
  string,
  { articles: StepResourceLink[]; terms: StepResourceLink[]; mapSteps: StepResourceLink[] }
>;

export default function PathChecklist({
  slug,
  steps,
  resources = {}
}: {
  slug: string;
  steps: LearnPathStep[];
  resources?: StepResources;
}) {
  const [state, setState] = useState<ProgressState>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(slug));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setState(parsed as ProgressState);
        }
      } catch {
        setState({});
      }
    }
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(storageKey(slug), JSON.stringify(state));
  }, [slug, state]);

  const progress = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((step) => state[step.id]).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [state, steps]);

  const nextStep = useMemo(() => steps.find((step) => !state[step.id]), [steps, state]);

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Progress</p>
          <h3 className="mt-1 text-lg font-semibold text-ink-900">{progress.percent}% 완료</h3>
          <p className="text-sm text-ink-600">
            {progress.completed}/{progress.total} 단계 완료
          </p>
        </div>
        {nextStep ? (
          <div className="rounded-xl border border-ink-200/60 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">다음 추천</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{nextStep.title}</p>
            <p className="mt-1 text-xs text-ink-600">{nextStep.goal_one_line}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-ink-200/60 bg-white px-4 py-3 text-sm text-ink-600">
            모든 단계를 완료했습니다.
          </div>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <label key={step.id} className="card flex gap-3">
            <input
              type="checkbox"
              checked={Boolean(state[step.id])}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  [step.id]: event.target.checked
                }))
              }
              className="mt-1 h-4 w-4"
            />
            <div className="w-full">
              <h4 className="text-base font-semibold text-ink-900">{step.title}</h4>
              <p className="mt-1 text-sm text-ink-600">{step.goal_one_line}</p>
              <div className="mt-3 grid gap-2 text-xs text-ink-600 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-ink-500">관련 글</p>
                  <div className="mt-1 space-y-1">
                    {(resources[step.id]?.articles ?? []).map((item) => (
                      <a key={item.href} href={item.href} className="block text-accent-600">
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink-500">관련 용어</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(resources[step.id]?.terms ?? []).map((item) => (
                      <a key={item.href} href={item.href} className="rounded-full border border-ink-200/60 px-2 py-1">
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-ink-500">지도 단계</p>
                  <div className="mt-1 space-y-1">
                    {(resources[step.id]?.mapSteps ?? []).map((item) => (
                      <a key={item.href} href={item.href} className="block text-accent-600">
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
