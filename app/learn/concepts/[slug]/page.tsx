import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticles, getGlossary, getLearnConceptBySlug, getLearnConcepts } from '@/lib/content';
import { recommendByTags } from '@/lib/recommend';
import NextCTA from '@/components/NextCTA';
import SourceNotice from '@/components/SourceNotice';
import SourceSummaryCard from '@/components/SourceSummaryCard';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Learn Concept | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLearnConcepts().map((concept) => ({ slug: concept.slug }));
}

export default function LearnConceptDetailPage({ params }: { params: { slug: string } }) {
  const concept = getLearnConceptBySlug(params.slug);
  if (!concept) return notFound();

  const glossary = getGlossary();
  const articles = getArticles();
  const conceptMap = new Map(getLearnConcepts().map((item) => [item.slug, item.title]));

  const relatedTerms = recommendByTags(glossary, concept.tags, concept.audiences, 5);
  const relatedArticles = recommendByTags(articles, concept.tags, concept.audiences, 3);
  const summaryLines = [
    concept.one_line,
    `선수개념 ${concept.prereq_concepts.length}개`,
    `후속개념 ${concept.next_concepts.length}개`
  ];

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `learn-concept:${concept.slug}`,
          title: concept.title,
          href: `/learn/concepts/${concept.slug}`,
          type: 'Learn Concept',
          section: 'learn'
        }}
      />
      <SummaryCard
        label="Learn Concept"
        title={concept.title}
        summaryLines={summaryLines}
        tags={concept.tags}
        updatedAt={concept.updated_at}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SourceNotice
          sources={concept.sources}
          recommendedSources={1}
          note="학습용 개념 카드는 출처 1개 이상을 권장합니다."
        />
        <SourceSummaryCard sources={concept.sources} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">선수개념</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {concept.prereq_concepts.length === 0 ? (
              <p className="muted">없음</p>
            ) : (
              concept.prereq_concepts.map((slug) => (
                <Link key={slug} href={`/learn/concepts/${slug}`} className="block text-accent-600">
                  {conceptMap.get(slug) ?? slug}
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">후속개념</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {concept.next_concepts.length === 0 ? (
              <p className="muted">없음</p>
            ) : (
              concept.next_concepts.map((slug) => (
                <Link key={slug} href={`/learn/concepts/${slug}`} className="block text-accent-600">
                  {conceptMap.get(slug) ?? slug}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">정의 3줄</h2>
        <div className="prose max-w-none text-ink-700">
          {concept.body ? <MDXRemote source={concept.body} /> : <p>정의 설명을 준비 중입니다.</p>}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h3 className="section-title">관련 용어</h3>
          <div className="flex flex-wrap gap-2 text-xs text-ink-600">
            {relatedTerms.map((term) => (
              <Link key={term.slug} href={`/glossary/${term.slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
                {term.term}
              </Link>
            ))}
          </div>
        </div>
        <div className="card space-y-2">
          <h3 className="section-title">관련 글</h3>
          <div className="space-y-2 text-sm text-ink-600">
            {relatedArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="block rounded-lg border border-ink-200/60 px-3 py-2">
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NextCTA description="학습 경로로 돌아가 진행률을 체크하세요." href="/learn/paths" label="학습 경로 보기" />
    </div>
  );
}
