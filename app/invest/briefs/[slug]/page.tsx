import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getInvestBriefBySlug, getInvestBriefs } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import SourceNotice from '@/components/SourceNotice';
import SourceSummaryCard from '@/components/SourceSummaryCard';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Invest Brief | WaferWiki v2'
};

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return getInvestBriefs().map((brief) => ({ slug: brief.slug }));
}

export default function InvestBriefDetailPage({ params }: { params: { slug: string } }) {
  const brief = getInvestBriefBySlug(params.slug);
  if (!brief) return notFound();
  const displayTags = Array.from(new Set([...(brief.tags ?? []), brief.period].filter(Boolean)));

  return (
    <div className="space-y-8">
      <RecentViewTracker
        item={{
          id: `invest-brief:${brief.slug}`,
          title: brief.title,
          href: `/invest/briefs/${brief.slug}`,
          type: 'Invest Brief',
          section: 'invest'
        }}
      />
      <SummaryCard
        label={`${brief.period} brief`}
        title={brief.title}
        summaryLines={brief.summary_3lines ?? []}
        tags={displayTags}
        updatedAt={brief.updated_at}
      />

      <section className="prose max-w-none text-ink-700">
        {brief.body ? <MDXRemote source={brief.body} /> : <p>브리핑 상세는 업데이트 예정입니다.</p>}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SourceNotice
          sources={brief.sources}
          minSources={2}
          note="Investor 콘텐츠는 출처 2개 미만이면 빌드가 실패합니다."
        />
        <SourceSummaryCard sources={brief.sources} />
      </div>

      <NextCTA description="테마 목록에서 더 많은 키워드를 확인하세요." href="/invest/themes" label="테마 보기" />
    </div>
  );
}
