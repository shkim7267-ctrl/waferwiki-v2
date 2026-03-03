import InvestBriefsList from '@/components/InvestBriefsList';
import { getInvestBriefs } from '@/lib/content';

export const metadata = {
  title: 'Invest Briefs | WaferWiki v2'
};

export default function InvestBriefsPage() {
  const briefs = getInvestBriefs();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">브리핑</h1>
        <p className="text-sm text-ink-600">주간/일간 브리핑을 통해 키워드를 빠르게 파악합니다.</p>
      </section>

      <InvestBriefsList briefs={briefs} />
    </div>
  );
}
