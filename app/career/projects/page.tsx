import CareerProjectsList from '@/components/CareerProjectsList';
import { getCareerProjects } from '@/lib/content';

export const metadata = {
  title: 'Career Projects | WaferWiki v2'
};

export default function CareerProjectsPage() {
  const projects = getCareerProjects();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">미니 프로젝트</h1>
        <p className="text-sm text-ink-600">직무 준비에 도움이 되는 미니 프로젝트 템플릿입니다.</p>
      </section>

      <CareerProjectsList projects={projects} />
    </div>
  );
}
