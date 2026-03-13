import Link from 'next/link';
import LearnConceptsList from '@/components/LearnConceptsList';
import { getLearnConcepts } from '@/lib/content';

export const metadata = {
  title: 'Learn Concepts | WaferWiki v2'
};

export default function LearnConceptsPage() {
  const concepts = getLearnConcepts();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">개념 카드</h1>
        <p className="text-sm text-ink-600">선수개념과 후속개념을 연결해 학습합니다.</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/learn/graph"
            className="rounded-full border border-accent-500 px-3 py-1 text-xs font-semibold text-accent-600"
          >
            개념 그래프 보기
          </Link>
        </div>
      </section>

      <LearnConceptsList concepts={concepts} />
    </div>
  );
}
