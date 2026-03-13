import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticles, getGlossary, getLearnConceptBySlug, getLearnConcepts } from '@/lib/content';
import { getLearnTrails } from '@/lib/learn-trails';
import { recommendByTags } from '@/lib/recommend';
import NextCTA from '@/components/NextCTA';
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
  const allConcepts = getLearnConcepts();
  const conceptMap = new Map(allConcepts.map((item) => [item.slug, item.title]));

  const relatedTerms = recommendByTags(glossary, concept.tags, concept.audiences, 5);
  const relatedArticles = recommendByTags(articles, concept.tags, concept.audiences, 3);
  const summaryLines = [
    concept.one_line,
    `선수개념 ${concept.prereq_concepts.length}개`,
    `후속개념 ${concept.next_concepts.length}개`
  ];
  const relatedConcepts = concept.related_concepts ?? [];
  const backlinks = allConcepts
    .filter((item) =>
      item.slug !== concept.slug &&
      (item.prereq_concepts.includes(concept.slug) ||
        item.next_concepts.includes(concept.slug) ||
        item.related_concepts.includes(concept.slug))
    )
    .map((item) => item.slug);
  const trails = getLearnTrails().filter((trail) => trail.concepts.includes(concept.slug));

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

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-2">
          <h2 className="section-title">연관 개념</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {relatedConcepts.length === 0 ? (
              <p className="muted">없음</p>
            ) : (
              relatedConcepts.map((slug) => (
                <Link key={slug} href={`/learn/concepts/${slug}`} className="block text-accent-600">
                  {conceptMap.get(slug) ?? slug}
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">백링크</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {backlinks.length === 0 ? (
              <p className="muted">없음</p>
            ) : (
              backlinks.map((slug) => (
                <Link key={slug} href={`/learn/concepts/${slug}`} className="block text-accent-600">
                  {conceptMap.get(slug) ?? slug}
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">학습 트레일</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {trails.length === 0 ? (
              <p className="muted">없음</p>
            ) : (
              trails.map((trail) => (
                <div key={trail.id} className="rounded-lg border border-ink-200/60 px-3 py-2">
                  <p className="text-sm font-semibold text-ink-800">{trail.title}</p>
                  <p className="mt-1 text-xs text-ink-500">
                    {trail.concepts.map((slug) => conceptMap.get(slug) ?? slug).join(' → ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

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

      {concept.resources.length > 0 ? (
        <section className="space-y-3">
          <h2 className="section-title">학습 자료</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {concept.resources.map((resource) => (
              <a
                key={`${resource.type}-${resource.url}`}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="card hover:border-accent-500"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
                  {resource.type === 'video' ? 'Video' : 'Article'}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-900">{resource.title}</p>
                <p className="mt-1 text-xs text-ink-500">{resource.source}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

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
