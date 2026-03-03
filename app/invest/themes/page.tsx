import InvestThemesList from '@/components/InvestThemesList';
import { getInvestThemes } from '@/lib/content';

export const metadata = {
  title: 'Invest Themes | WaferWiki v2'
};

export default function InvestThemesPage() {
  const themes = getInvestThemes();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">테마/기술 목록</h1>
        <p className="text-sm text-ink-600">기술 키워드를 공급망/세그먼트 관점으로 정리합니다.</p>
      </section>

      <InvestThemesList themes={themes} />
    </div>
  );
}
