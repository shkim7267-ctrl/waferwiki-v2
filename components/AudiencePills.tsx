'use client';

import { AUDIENCES, type Audience } from '@/lib/schema';

const labels: Record<Audience, string> = {
  general: '일반인',
  investor: '투자자',
  student: '대학생',
  jobseeker: '취준생'
};

export default function AudiencePills({
  selected,
  onChange,
  size = 'md'
}: {
  selected: Audience;
  onChange: (audience: Audience) => void;
  size?: 'sm' | 'md';
}) {
  const baseClass =
    size === 'sm' ? 'rounded-full px-2 py-0.5 text-[10px]' : 'rounded-full px-3 py-1 text-xs';

  return (
    <div className="flex flex-wrap gap-2">
      {AUDIENCES.map((audience) => (
        <button
          key={audience}
          type="button"
          onClick={() => onChange(audience)}
          aria-pressed={selected === audience}
          className={
            selected === audience
              ? `${baseClass} bg-ink-900 font-medium text-white ring-1 ring-accent-500`
              : `${baseClass} border border-ink-200/60 text-ink-600`
          }
        >
          {labels[audience]}
        </button>
      ))}
    </div>
  );
}
