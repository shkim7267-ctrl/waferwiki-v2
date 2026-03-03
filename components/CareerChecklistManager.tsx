'use client';

import { useEffect, useState } from 'react';
import type { CareerRole, SkillMatrixCategory } from '@/lib/schema';

const storageKey = (slug: string) => `waferwiki.career.role.${slug}`;

type ItemState = { checked: boolean; memo: string };

type RoleState = Record<string, Record<string, ItemState>>;

type RoleData = {
  slug: string;
  title: string;
  matrix: SkillMatrixCategory[];
};

export default function CareerChecklistManager({ roles }: { roles: CareerRole[] }) {
  const [state, setState] = useState<Record<string, RoleState>>({});

  useEffect(() => {
    const next: Record<string, RoleState> = {};
    roles.forEach((role) => {
      const raw = localStorage.getItem(storageKey(role.slug));
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') next[role.slug] = parsed as RoleState;
        } catch {
          next[role.slug] = {};
        }
      } else {
        next[role.slug] = {};
      }
    });
    setState(next);
  }, [roles]);

  const updateItem = (roleSlug: string, category: string, item: string, patch: Partial<ItemState>) => {
    setState((prev) => {
      const roleState = prev[roleSlug] ?? {};
      const categoryState = roleState[category] ?? {};
      const current = categoryState[item] ?? { checked: false, memo: '' };
      const next = {
        ...prev,
        [roleSlug]: {
          ...roleState,
          [category]: {
            ...categoryState,
            [item]: { ...current, ...patch }
          }
        }
      };
      localStorage.setItem(storageKey(roleSlug), JSON.stringify(next[roleSlug]));
      return next;
    });
  };

  const roleData: RoleData[] = roles.map((role) => ({
    slug: role.slug,
    title: role.title,
    matrix: role.skill_matrix
  }));

  return (
    <div className="space-y-6">
      {roleData.map((role) => (
        <div key={role.slug} className="card space-y-4">
          <div>
            <h2 className="section-title">{role.title}</h2>
            <p className="text-xs text-ink-500">역할별 준비 항목을 관리합니다.</p>
          </div>
          {role.matrix.map((block) => (
            <div key={block.category} className="rounded-lg border border-ink-200/60 p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink-900">{block.category}</h3>
                <span className="text-xs text-ink-500">{block.level_required}</span>
              </div>
              <div className="mt-3 space-y-2">
                {block.items.map((item) => {
                  const itemState = state[role.slug]?.[block.category]?.[item] ?? { checked: false, memo: '' };
                  return (
                    <div key={item} className="rounded-lg border border-ink-200/60 p-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
                        <input
                          type="checkbox"
                          checked={itemState.checked}
                          onChange={(event) =>
                            updateItem(role.slug, block.category, item, { checked: event.target.checked })
                          }
                        />
                        {item}
                      </label>
                      <input
                        value={itemState.memo}
                        onChange={(event) =>
                          updateItem(role.slug, block.category, item, { memo: event.target.value })
                        }
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
      ))}
    </div>
  );
}
