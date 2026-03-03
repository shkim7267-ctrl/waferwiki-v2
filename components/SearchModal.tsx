'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { buildSearchIndex, searchDocs, type SearchDoc } from '@/lib/search';
import HighlightText from '@/components/HighlightText';

export default function SearchModal({ docs }: { docs: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { index, map } = useMemo(() => buildSearchIndex(docs), [docs]);
  const results = useMemo(() => searchDocs(index, map, query), [index, map, query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-ink-200/60 px-3 py-1 text-xs text-ink-600"
      >
        Search
        <span className="ml-2 text-[10px] text-ink-400">⌘K</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900">통합 검색</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-ink-500">
                닫기
              </button>
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="용어, 글, 테마, 경로 등을 검색"
              className="mt-3 w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
            />
            <div className="mt-4 max-h-[60vh] space-y-3 overflow-auto">
              {query.trim() === '' ? (
                <p className="text-sm text-ink-500">검색어를 입력하세요.</p>
              ) : results.length === 0 ? (
                <p className="text-sm text-ink-500">검색 결과가 없습니다.</p>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl border border-ink-200/60 px-4 py-3 hover:border-accent-500"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-500">{result.type}</p>
                    <h3 className="mt-1 text-sm font-semibold text-ink-900">
                      <HighlightText text={result.title} query={query} />
                    </h3>
                    <p className="mt-1 text-xs text-ink-600">
                      <HighlightText text={result.summary ?? ''} query={query} />
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
