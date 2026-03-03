import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getGlossary, getGlossaryBySlug } from '@/lib/content';
import { recommendByTags } from '@/lib/recommend';
import NextCTA from '@/components/NextCTA';
import SourceNotice from '@/components/SourceNotice';
import SourceSummaryCard from '@/components/SourceSummaryCard';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: '용어 상세 | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getGlossary().map((item) => ({ slug: item.slug }));
}

export default function GlossaryDetailPage({ params }: { params: { slug: string } }) {
  const entry = getGlossaryBySlug(params.slug);
  if (!entry) return notFound();

  const glossary = getGlossary().filter((item) => item.slug !== entry.slug);
  const articles = getArticles();
  const relatedTerms = recommendByTags(glossary, entry.tags, entry.audiences, 4);
  const relatedArticles = recommendByTags(articles, entry.tags, entry.audiences, 3);

  return (
    <div className="space-y-8">
      <RecentViewTracker
        item={{
          id: `glossary:${entry.slug}`,
          title: entry.term,
          href: `/glossary/${entry.slug}`,
          type: 'Glossary',
          section: 'glossary'
        }}
      />
      <SummaryCard
        label="Glossary"
        title={entry.term}
        summaryLines={[entry.one_line, entry.why_it_matters, entry.where_it_appears]}
        tags={entry.tags}
        updatedAt={entry.updated_at}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SourceNotice
          sources={entry.sources}
          recommendedSources={1}
          note="용어 사전은 출처 0~2개를 허용하며, 1개 이상을 권장합니다."
        />
        <SourceSummaryCard sources={entry.sources} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">왜 중요한가?</h2>
          <p className="text-sm text-ink-600">{entry.why_it_matters}</p>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">어디서 등장하나?</h2>
          <p className="text-sm text-ink-600">{entry.where_it_appears}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="section-title">관련 용어</h3>
          <div className="flex flex-wrap gap-2 text-xs text-ink-600">
            {relatedTerms.map((term) => (
              <Link key={term.slug} href={`/glossary/${term.slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
                {term.term}
              </Link>
            ))}
          </div>
        </div>
        <div className="card space-y-3">
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

      <NextCTA description="공정 지도로 돌아가 전체 흐름을 확인하세요." href="/map" label="공정 지도 보기" />
    </div>
  );
}
