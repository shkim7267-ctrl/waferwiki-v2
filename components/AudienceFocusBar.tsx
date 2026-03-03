'use client';

import Link from 'next/link';
import { useAudience } from '@/components/AudienceProvider';
import type { Audience } from '@/lib/schema';

const focusMap: Record<
  Audience,
  { title: string; description: string; links: { label: string; href: string }[] }
> = {
  general: {
    title: '추천 흐름',
    description: '큰그림 → 공정 → 용어 순서로 보세요.',
    links: [
      { label: '10분 스타터', href: '/start' },
      { label: '공정 지도', href: '/map' },
      { label: '용어사전', href: '/glossary' }
    ]
  },
  investor: {
    title: '추천 흐름',
    description: '테마 → 브리핑 → 기업 순서로 맥락을 잡으세요.',
    links: [
      { label: '테마', href: '/invest/themes' },
      { label: '브리핑', href: '/invest/briefs' },
      { label: '기업', href: '/invest/companies' }
    ]
  },
  student: {
    title: '추천 흐름',
    description: '경로 → 개념 → 퀴즈로 학습을 이어가세요.',
    links: [
      { label: '학습 경로', href: '/learn/paths' },
      { label: '개념 카드', href: '/learn/concepts' },
      { label: '퀴즈', href: '/learn/quiz' }
    ]
  },
  jobseeker: {
    title: '추천 흐름',
    description: '직무 → 질문 → 프로젝트로 준비하세요.',
    links: [
      { label: '직무맵', href: '/career/roles' },
      { label: '면접 Q뱅크', href: '/career/questions' },
      { label: '프로젝트', href: '/career/projects' }
    ]
  }
};

export default function AudienceFocusBar() {
  const { audience } = useAudience();
  const focus = focusMap[audience];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-ink-200/60 bg-ink-50/40 px-3 py-2 text-xs text-ink-600">
      <span className="font-semibold text-ink-800">{focus.title}</span>
      <span className="text-ink-500">{focus.description}</span>
      <div className="flex flex-wrap gap-2">
        {focus.links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              index === 0
                ? 'rounded-full bg-accent-600 px-3 py-1 text-xs font-medium text-white'
                : 'rounded-full border border-ink-200/60 px-3 py-1 text-xs text-ink-600'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
