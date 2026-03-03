import LearnPathsList from '@/components/LearnPathsList';
import { getLearnPaths } from '@/lib/content';

export const metadata = {
  title: 'Learn Paths | WaferWiki v2'
};

export default function LearnPathsPage() {
  const paths = getLearnPaths();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">학습 경로</h1>
        <p className="text-sm text-ink-600">기초를 체계적으로 따라갈 수 있는 경로입니다.</p>
      </section>

      <LearnPathsList paths={paths} />
    </div>
  );
}
