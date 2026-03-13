import Link from 'next/link';
import { getLearnPaths } from '@/lib/content';
import LearnProgressWidget from '@/components/LearnProgressWidget';
import RecentViewList from '@/components/RecentViewList';

export const metadata = {
  title: 'Learn | WaferWiki v2'
};

export default function LearnHomePage() {
  const paths = getLearnPaths();

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Learn Hub</p>
        <h1 className="text-3xl font-semibold text-ink-900">대학생 학습 허브</h1>
        <p className="text-sm text-ink-600">
          학습 로드맵과 선수개념을 따라 반도체 기초를 체계적으로 학습합니다.
        </p>
        <div className="rounded-2xl border border-ink-200/60 bg-white px-4 py-3 text-sm text-ink-700">
          <span className="font-semibold text-ink-900">추천 학습 흐름:</span> 경로 선택 → 개념 카드 → 퀴즈로 확인 → Map으로 큰그림 복습
        </div>
      </section>

      <RecentViewList section="learn" />

      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {paths.slice(0, 3).map((path) => (
            <Link key={path.slug} href={`/learn/paths/${path.slug}`} className="card hover:border-accent-500">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{path.level}</p>
              <h2 className="mt-2 text-base font-semibold text-ink-900">{path.title}</h2>
              <p className="mt-2 text-sm text-ink-600">{path.steps[0]?.goal_one_line ?? '학습 목표를 준비 중입니다.'}</p>
            </Link>
          ))}
        </div>
        <LearnProgressWidget paths={paths} />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Link href="/learn/paths" className="card">
          <h3 className="section-title">학습 경로</h3>
          <p className="mt-2 text-sm text-ink-600">과정별 체크리스트와 진행률을 확인합니다.</p>
        </Link>
        <Link href="/learn/concepts" className="card">
          <h3 className="section-title">개념 카드</h3>
          <p className="mt-2 text-sm text-ink-600">선수개념과 후속개념을 연결해 학습합니다.</p>
        </Link>
        <Link href="/learn/graph" className="card">
          <h3 className="section-title">개념 그래프</h3>
          <p className="mt-2 text-sm text-ink-600">개념 연결을 한눈에 탐색합니다.</p>
        </Link>
        <Link href="/learn/quiz" className="card">
          <h3 className="section-title">퀴즈</h3>
          <p className="mt-2 text-sm text-ink-600">핵심 개념을 점검하는 간단 퀴즈입니다.</p>
        </Link>
      </section>
    </div>
  );
}
