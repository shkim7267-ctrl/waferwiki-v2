'use client';

import type { ReactNode } from 'react';

type SortOption = {
  value: string;
  label: string;
};

type ListToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  tagOptions: string[];
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  density?: 'comfortable' | 'compact';
  onDensityChange?: (value: string) => void;
  placeholder?: string;
  secondary?: ReactNode;
};

export default function ListToolbar({
  query,
  onQueryChange,
  selectedTag,
  onTagChange,
  tagOptions,
  sort,
  onSortChange,
  sortOptions,
  density,
  onDensityChange,
  placeholder = '검색어를 입력하세요.',
  secondary
}: ListToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">검색</label>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
          />
        </div>
        <div className="space-y-3">
          {secondary}
          <div>
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">정렬</label>
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {density && onDensityChange ? (
            <div>
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">카드 밀도</label>
              <div className="mt-2 inline-flex overflow-hidden rounded-full border border-ink-200/60 text-xs">
                <button
                  type="button"
                  onClick={() => onDensityChange('comfortable')}
                  className={
                    density === 'comfortable'
                      ? 'bg-ink-900 px-3 py-1 text-white'
                      : 'bg-white px-3 py-1 text-ink-600'
                  }
                >
                  일반
                </button>
                <button
                  type="button"
                  onClick={() => onDensityChange('compact')}
                  className={
                    density === 'compact' ? 'bg-ink-900 px-3 py-1 text-white' : 'bg-white px-3 py-1 text-ink-600'
                  }
                >
                  콤팩트
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onTagChange('')}
          className={
            selectedTag === ''
              ? 'rounded-full bg-ink-900 px-3 py-1 text-xs font-medium text-white'
              : 'rounded-full border border-ink-200/60 px-3 py-1 text-xs text-ink-600'
          }
        >
          전체 태그
        </button>
        {tagOptions.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange(tag)}
            className={
              selectedTag === tag
                ? 'rounded-full bg-ink-900 px-3 py-1 text-xs font-medium text-white'
                : 'rounded-full border border-ink-200/60 px-3 py-1 text-xs text-ink-600'
            }
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
