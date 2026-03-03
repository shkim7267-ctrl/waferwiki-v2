import CareerRolesList from '@/components/CareerRolesList';
import { getCareerRoles } from '@/lib/content';

export const metadata = {
  title: 'Career Roles | WaferWiki v2'
};

export default function CareerRolesPage() {
  const roles = getCareerRoles();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">직무맵</h1>
        <p className="text-sm text-ink-600">직무별 역할과 준비 항목을 정리합니다.</p>
        <p className="text-xs text-ink-500">
          SK hynix 채용 직무 소개의 분류를 참고해 직무를 재구성했습니다. 실제 채용 공고에 따라 범위가 달라질 수 있습니다.
        </p>
      </section>

      <CareerRolesList roles={roles} />
    </div>
  );
}
