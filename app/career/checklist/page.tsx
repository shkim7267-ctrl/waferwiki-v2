import { getCareerRoles } from '@/lib/content';
import CareerChecklistManager from '@/components/CareerChecklistManager';

export const metadata = {
  title: 'Career Checklist | WaferWiki v2'
};

export default function CareerChecklistPage() {
  const roles = getCareerRoles();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">나만의 준비 체크리스트</h1>
        <p className="text-sm text-ink-600">모든 직무의 체크/메모를 한 곳에서 관리합니다.</p>
      </section>

      <CareerChecklistManager roles={roles} />
    </div>
  );
}
