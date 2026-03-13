import LearnGraphView from '@/components/LearnGraph';
import { getLearnConcepts } from '@/lib/content';
import { buildLearnGraph } from '@/lib/learn-graph';

export const metadata = {
  title: 'Learn Graph | WaferWiki v2'
};

export default function LearnGraphPage() {
  const concepts = getLearnConcepts();
  const graph = buildLearnGraph(concepts);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Learn Graph</p>
        <h1 className="text-2xl font-semibold text-ink-900">개념 온톨로지 그래프</h1>
        <p className="text-sm text-ink-600">
          개념 간 연결을 한눈에 확인하고, 노드를 클릭해 상세 설명으로 이동하세요. (줌/팬 가능)
        </p>
      </section>

      <LearnGraphView graph={graph} />
    </div>
  );
}
