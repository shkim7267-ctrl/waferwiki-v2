'use client';

import type { Audience } from '@/lib/schema';

const labels: Record<Audience, string> = {
  general: '일반인',
  investor: '투자자',
  student: '대학생',
  jobseeker: '취준생'
};

export default function AudienceEmptyState({
  audience,
  available,
  onSelect,
  sectionLabel
}: {
  audience: Audience;
  available: Audience[];
  onSelect: (audience: Audience) => void;
  sectionLabel: string;
}) {
  if (available.length === 0) {
    return (
      <section className="card">
        <h3 className="section-title">콘텐츠 준비 중</h3>
        <p className="mt-2 text-sm text-ink-600">{sectionLabel} 콘텐츠를 준비 중입니다.</p>
      </section>
    );
  }

  return (
    <section className="card space-y-3">
      <h3 className="section-title">필터에 맞는 콘텐츠가 없어요</h3>
      <p className="text-sm text-ink-600">
        현재 <span className="font-semibold text-ink-800">{labels[audience]}</span> 기준에서는 {sectionLabel}{' '}
        콘텐츠가 없습니다.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-ink-600">
        {available.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-full border border-ink-200/60 px-3 py-1"
          >
            {labels[item]}로 전환
          </button>
        ))}
      </div>
    </section>
  );
}
