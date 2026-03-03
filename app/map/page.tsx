import Link from 'next/link';
import { getArticles, getGlossary, getMapSteps } from '@/lib/content';
import MapFlow from '@/components/MapFlow';
import NextCTA from '@/components/NextCTA';

export const metadata = {
  title: '공정 큰그림 지도 | WaferWiki v2'
};

export default function MapPage() {
  const steps = getMapSteps();
  const glossary = getGlossary();
  const articles = getArticles();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">공정 큰그림 지도</h1>
        <p className="text-sm text-ink-600">
          Wafer → Lithography → Etch → Deposition → Interconnect → Test → Packaging 흐름을 단계별로 탐색합니다.
        </p>
      </section>

      <MapFlow steps={steps} glossary={glossary} articles={articles} />

      <NextCTA description="쉬운 용어사전에서 핵심 용어를 정리해보세요." href="/glossary" label="용어사전 보기" />
    </div>
  );
}
