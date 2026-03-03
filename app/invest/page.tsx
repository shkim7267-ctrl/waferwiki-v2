import Link from 'next/link';
import { getInvestBriefs, getInvestThemes } from '@/lib/content';
import RecentViewList from '@/components/RecentViewList';

export const metadata = {
  title: 'Invest | WaferWiki v2'
};

export default function InvestHomePage() {
  const themes = getInvestThemes();
  const briefs = getInvestBriefs();

  const todayKeywords = themes.slice(0, 3);
  const weeklyBriefs = briefs.filter((brief) => brief.period === 'weekly').slice(0, 3);
  const hotThemes = themes.slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Invest Hub</p>
        <h1 className="text-3xl font-semibold text-ink-900">투자자용 맥락 허브</h1>
        <p className="text-sm text-ink-600">
          뉴스와 기술 키워드가 기업·세그먼트·공급망에 어떤 의미인지 빠르게 파악하도록 돕습니다.
          투자 조언이나 가격 전망은 제공하지 않습니다.
        </p>
      </section>

      <RecentViewList section="invest" />

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/invest/themes" className="card hover:border-accent-500">
          <h2 className="section-title">테마/기술 목록</h2>
          <p className="mt-2 text-sm text-ink-600">HBM, CoWoS, EUV 등 테마를 공급망 관점으로 정리합니다.</p>
        </Link>
        <a
          href="https://semibridge.pages.dev"
          target="_blank"
          rel="noreferrer"
          className="card hover:border-accent-500"
        >
          <h2 className="section-title">Semibridge 기업 허브</h2>
          <p className="mt-2 text-sm text-ink-600">기업/포지셔닝 정보는 Semibridge에서 확인합니다.</p>
        </a>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">오늘의 키워드</h2>
          <Link href="/invest/themes" className="text-sm font-semibold text-accent-600">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {todayKeywords.map((theme) => (
            <Link key={theme.slug} href={`/invest/themes/${theme.slug}`} className="card">
              <h3 className="text-base font-semibold text-ink-900">{theme.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{theme.summary_3lines[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">주간 브리핑</h2>
          <Link href="/invest/briefs" className="text-sm font-semibold text-accent-600">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {weeklyBriefs.map((brief) => (
            <Link key={brief.slug} href="/invest/briefs" className="card">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Weekly</p>
              <h3 className="mt-2 text-base font-semibold text-ink-900">{brief.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{brief.summary_3lines?.[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">핫 테마</h2>
          <Link href="/invest/themes" className="text-sm font-semibold text-accent-600">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {hotThemes.map((theme) => (
            <Link key={theme.slug} href={`/invest/themes/${theme.slug}`} className="card">
              <h3 className="text-base font-semibold text-ink-900">{theme.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-500">
                {theme.segments.slice(0, 3).map((segment) => (
                  <span key={segment} className="rounded-full border border-ink-200/60 px-2 py-1">
                    {segment}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
