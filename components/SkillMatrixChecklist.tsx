'use client';

import { useEffect, useState } from 'react';
import type { SkillMatrixCategory } from '@/lib/schema';

const storageKey = (slug: string) => `waferwiki.career.role.${slug}`;

type ItemState = { checked: boolean; memo: string };

type RoleState = Record<string, Record<string, ItemState>>;

export default function SkillMatrixChecklist({
  roleSlug,
  matrix
}: {
  roleSlug: string;
  matrix: SkillMatrixCategory[];
}) {
  const [state, setState] = useState<RoleState>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(roleSlug));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setState(parsed as RoleState);
      } catch {
        setState({});
      }
    }
  }, [roleSlug]);

  useEffect(() => {
    localStorage.setItem(storageKey(roleSlug), JSON.stringify(state));
  }, [roleSlug, state]);

  const updateItem = (category: string, item: string, patch: Partial<ItemState>) => {
    setState((prev) => {
      const categoryState = prev[category] ?? {};
      const current = categoryState[item] ?? { checked: false, memo: '' };
      return {
        ...prev,
        [category]: {
          ...categoryState,
          [item]: { ...current, ...patch }
        }
      };
    });
  };

  return (
    <div className="space-y-4">
      {matrix.map((block) => (
        <div key={block.category} className="card space-y-3">
          <div>
            <h3 className="section-title">{block.category}</h3>
            <p className="text-xs text-ink-500">권장 수준: {block.level_required}</p>
          </div>
          <div className="space-y-3">
            {block.items.map((item) => {
              const itemState = state[block.category]?.[item] ?? { checked: false, memo: '' };
              return (
                <div key={item} className="rounded-lg border border-ink-200/60 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
                    <input
                      type="checkbox"
                      checked={itemState.checked}
                      onChange={(event) => updateItem(block.category, item, { checked: event.target.checked })}
                    />
                    {item}
                  </label>
                  <input
                    value={itemState.memo}
                    onChange={(event) => updateItem(block.category, item, { memo: event.target.value })}
                    placeholder="메모"
                    className="mt-2 w-full rounded-lg border border-ink-200/60 px-3 py-2 text-xs"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
