import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getArticles,
  getGlossary,
  getInvestEventsFor,
  getInvestThemeBySlug,
  getInvestThemes,
  getMapSteps
} from '@/lib/content';
import { recommendByTags } from '@/lib/recommend';
import NextCTA from '@/components/NextCTA';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Invest Theme | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getInvestThemes().map((theme) => ({ slug: theme.slug }));
}

export default function InvestThemeDetailPage({ params }: { params: { slug: string } }) {
  const theme = getInvestThemeBySlug(params.slug);
  if (!theme) return notFound();

  const glossary = getGlossary();
  const articles = getArticles();
  const mapSteps = getMapSteps();
  const events = getInvestEventsFor('theme', theme.slug);

  const relatedTerms = recommendByTags(glossary, theme.tags, theme.audiences, 5);
  const relatedArticles = recommendByTags(articles, theme.tags, theme.audiences, 3);
  const relatedMapSteps = recommendByTags(mapSteps, theme.tags, theme.audiences, 3);
  const displayTags = Array.from(new Set([...(theme.tags ?? []), ...(theme.segments ?? [])]));

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `invest-theme:${theme.slug}`,
          title: theme.title,
          href: `/invest/themes/${theme.slug}`,
          type: 'Invest Theme',
          section: 'invest'
        }}
      />
      <SummaryCard
        label="Invest Theme"
        title={theme.title}
        summaryLines={theme.summary_3lines}
        tags={displayTags}
        updatedAt={theme.updated_at}
      />

      <section className="space-y-4">
        <h2 className="section-title">Value Chain</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {theme.value_chain.map((item) => (
            <div key={`${item.layer}-${item.notes}`} className="card">
              <p className="text-sm font-semibold text-ink-900">{item.layer}</p>
              <p className="mt-2 text-sm text-ink-600">{item.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">왜 중요한가 (비즈니스 관점)</h2>
        <div className="prose max-w-none text-ink-700">
          {theme.body ? <MDXRemote source={theme.body} /> : <p>비즈니스 영향 경로 요약을 준비 중입니다.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">타임라인</h2>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="muted">등록된 사건이 없습니다.</p>
          ) : (
            events.map((event) => (
              <div key={`${event.date}-${event.title}`} className="card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-900">{event.title}</span>
                  <span className="text-xs text-ink-500">{event.date}</span>
                </div>
                <p className="mt-2 text-sm text-ink-600">{event.one_line}</p>
                {event.sources?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-500">
                    {event.sources.map((source) => (
                      <a
                        key={source}
                        href={source}
                        className="rounded-full border border-ink-200/60 px-2 py-1 text-ink-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-ink-500">출처 미표기</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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
        <div className="card space-y-2">
          <h3 className="section-title">관련 공정 단계</h3>
          <div className="space-y-2 text-sm text-ink-600">
            {relatedMapSteps.map((step) => (
              <Link key={step.slug} href={`/map`} className="block rounded-lg border border-ink-200/60 px-3 py-2">
                {step.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NextCTA description="브리핑 목록에서 최신 요약을 확인하세요." href="/invest/briefs" label="브리핑 보기" />
    </div>
  );
}
