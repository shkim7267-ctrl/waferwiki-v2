'use client';

import { useEffect, useState } from 'react';
import type { CareerRole } from '@/lib/schema';

const storageKey = (slug: string) => `waferwiki.career.role.${slug}`;

type ItemState = { checked: boolean; memo: string };

type RoleState = Record<string, Record<string, ItemState>>;

type Summary = { slug: string; title: string; percent: number };

export default function CareerProgressWidget({ roles }: { roles: CareerRole[] }) {
  const [summaries, setSummaries] = useState<Summary[]>([]);

  useEffect(() => {
    const next = roles.map((role) => {
      const raw = localStorage.getItem(storageKey(role.slug));
      let state: RoleState = {};
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') state = parsed as RoleState;
        } catch {
          state = {};
        }
      }

      const totalItems = role.skill_matrix.reduce((acc, block) => acc + block.items.length, 0);
      const completed = role.skill_matrix.reduce((acc, block) => {
        const blockState = state[block.category] ?? {};
        const count = block.items.filter((item) => blockState[item]?.checked).length;
        return acc + count;
      }, 0);
      const percent = totalItems === 0 ? 0 : Math.round((completed / totalItems) * 100);
      return { slug: role.slug, title: role.title, percent };
    });
    setSummaries(next);
  }, [roles]);

  return (
    <div className="card space-y-3">
      <h2 className="section-title">내 체크리스트 진행률</h2>
      <div className="space-y-2">
        {summaries.map((summary) => (
          <div key={summary.slug} className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-900">{summary.title}</span>
            <span className="text-ink-600">{summary.percent}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-500">진행률은 브라우저 로컬 저장소에 저장됩니다.</p>
    </div>
  );
}
