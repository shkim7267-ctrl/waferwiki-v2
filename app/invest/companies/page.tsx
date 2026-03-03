import InvestCompaniesList from '@/components/InvestCompaniesList';
import { getInvestCompanies } from '@/lib/content';

export const metadata = {
  title: 'Invest Companies | WaferWiki v2'
};

export default function InvestCompaniesPage() {
  const companies = getInvestCompanies();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">회사 목록</h1>
        <p className="text-sm text-ink-600">기술/테마 관점의 포지셔닝을 요약합니다.</p>
      </section>

      <InvestCompaniesList companies={companies} />
    </div>
  );
}
