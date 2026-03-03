import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getGlossary, getLearnPathBySlug, getLearnPaths, getMapSteps } from '@/lib/content';
import PathChecklist from '@/components/PathChecklist';
import NextCTA from '@/components/NextCTA';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Learn Path | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLearnPaths().map((path) => ({ slug: path.slug }));
}

export default function LearnPathDetailPage({ params }: { params: { slug: string } }) {
  const path = getLearnPathBySlug(params.slug);
  if (!path) return notFound();

  const glossary = getGlossary();
  const articles = getArticles();
  const mapSteps = getMapSteps();

  const articleMap = new Map(articles.map((item) => [item.slug, item.title]));
  const termMap = new Map(glossary.map((item) => [item.slug, item.term]));
  const mapStepMap = new Map(mapSteps.map((item) => [item.slug, item.title]));

  const resources = Object.fromEntries(
    path.steps.map((step) => [
      step.id,
      {
        articles: step.related_articles
          .map((slug) => ({ title: articleMap.get(slug) ?? slug, href: `/articles/${slug}` }))
          .slice(0, 3),
        terms: step.related_terms
          .map((slug) => ({ title: termMap.get(slug) ?? slug, href: `/glossary/${slug}` }))
          .slice(0, 4),
        mapSteps: step.related_map_steps
          .map((slug) => ({ title: mapStepMap.get(slug) ?? slug, href: `/map` }))
          .slice(0, 3)
      }
    ])
  );
  const summaryLines = [
    `레벨: ${path.level}`,
    `총 ${path.steps.length}단계`,
    path.steps[0]?.goal_one_line ? `첫 목표: ${path.steps[0]?.goal_one_line}` : '첫 목표: 준비 중'
  ];

  return (
    <div className="space-y-8">
      <RecentViewTracker
        item={{
          id: `learn-path:${path.slug}`,
          title: path.title,
          href: `/learn/paths/${path.slug}`,
          type: 'Learn Path',
          section: 'learn'
        }}
      />
      <SummaryCard label="Learn Path" title={path.title} summaryLines={summaryLines} tags={path.tags} updatedAt={path.updated_at} />

      {path.body ? (
        <section className="space-y-3">
          <h2 className="section-title">경로 설명</h2>
          <div className="prose max-w-none text-ink-700">{path.body}</div>
        </section>
      ) : null}

      <PathChecklist slug={path.slug} steps={path.steps} resources={resources} />

      <NextCTA description="개념 카드에서 선수개념을 확인하세요." href="/learn/concepts" label="개념 카드 보기" />
    </div>
  );
}
