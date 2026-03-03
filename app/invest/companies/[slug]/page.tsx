import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getInvestBriefs, getInvestCompanies, getInvestCompanyBySlug, getInvestEventsFor, getInvestThemes } from '@/lib/content';
import { recommendByTags } from '@/lib/recommend';
import NextCTA from '@/components/NextCTA';
import SourceNotice from '@/components/SourceNotice';
import SourceSummaryCard from '@/components/SourceSummaryCard';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Invest Company | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getInvestCompanies().map((company) => ({ slug: company.slug }));
}

export default function InvestCompanyDetailPage({ params }: { params: { slug: string } }) {
  const company = getInvestCompanyBySlug(params.slug);
  if (!company) return notFound();

  const themes = getInvestThemes();
  const briefs = getInvestBriefs();
  const events = getInvestEventsFor('company', company.slug);

  const baseTags = Array.from(new Set([...company.positioning, ...company.tags]));
  const relatedThemes = recommendByTags(themes, baseTags, company.audiences, 6);
  const relatedBriefs = recommendByTags(briefs, baseTags, company.audiences, 3);
  const summaryLines = [
    company.positioning.length > 0 ? `포지셔닝: ${company.positioning.slice(0, 3).join(', ')}` : '포지셔닝: 준비 중',
    company.tags.length > 0 ? `키워드: ${company.tags.slice(0, 4).join(', ')}` : '키워드: 준비 중',
    '타임라인과 브리핑에서 맥락을 확인하세요.'
  ];

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `invest-company:${company.slug}`,
          title: company.title,
          href: `/invest/companies/${company.slug}`,
          type: 'Invest Company',
          section: 'invest'
        }}
      />
      <SummaryCard
        label="Invest Company"
        title={company.title}
        summaryLines={summaryLines}
        tags={baseTags}
        updatedAt={company.updated_at}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SourceNotice
          sources={company.sources}
          minSources={2}
          note="Investor 콘텐츠는 출처 2개 미만이면 빌드가 실패합니다."
        />
        <SourceSummaryCard sources={company.sources} />
      </div>

      <section className="space-y-3">
        <h2 className="section-title">포지셔닝 설명</h2>
        <div className="prose max-w-none text-ink-700">
          {company.body ? <MDXRemote source={company.body} /> : <p>포지셔닝 상세는 업데이트 예정입니다.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">관련 테마</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {relatedThemes.map((theme) => (
            <Link key={theme.slug} href={`/invest/themes/${theme.slug}`} className="card">
              <h3 className="text-base font-semibold text-ink-900">{theme.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{theme.summary_3lines[0]}</p>
            </Link>
          ))}
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

      <section className="space-y-3">
        <h2 className="section-title">관련 브리핑</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {relatedBriefs.map((brief) => (
            <Link key={brief.slug} href={`/invest/briefs/${brief.slug}`} className="card">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{brief.period}</p>
              <h3 className="mt-2 text-base font-semibold text-ink-900">{brief.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{brief.summary_3lines?.[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <NextCTA description="브리핑 목록에서 최신 브리핑을 확인하세요." href="/invest/briefs" label="브리핑 보기" />
    </div>
  );
}
