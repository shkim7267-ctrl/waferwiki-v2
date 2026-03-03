'use client';

import { useAudience } from '@/components/AudienceProvider';
import type { Audience } from '@/lib/schema';

const labels: Record<Audience, string> = {
  general: '일반인',
  investor: '투자자',
  student: '대학생',
  jobseeker: '취준생'
};

const descriptions: Record<Audience, string> = {
  general: '용어/입문 중심으로 추천·검색·리스트가 정렬됩니다.',
  investor: '테마/브리핑/기업 중심으로 추천·검색·리스트가 정렬됩니다.',
  student: '학습 경로/개념/퀴즈 중심으로 추천·검색·리스트가 정렬됩니다.',
  jobseeker: '직무/면접/프로젝트 중심으로 추천·검색·리스트가 정렬됩니다.'
};

export default function AudienceHint() {
  const { audience } = useAudience();

  return (
    <div className="text-xs text-ink-500">
      <span className="font-medium text-ink-700">현재 필터: {labels[audience]}</span>
      <span className="ml-2">{descriptions[audience]}</span>
    </div>
  );
}
