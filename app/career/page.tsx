import Link from 'next/link';
import { getCareerRoles } from '@/lib/content';
import CareerProgressWidget from '@/components/CareerProgressWidget';
import RecentViewList from '@/components/RecentViewList';
import PersonaScenario from '@/components/PersonaScenario';

export const metadata = {
  title: 'Career | WaferWiki v2'
};

export default function CareerHomePage() {
  const roles = getCareerRoles();

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Career Hub</p>
        <h1 className="text-3xl font-semibold text-ink-900">취준생 준비 허브</h1>
        <p className="text-sm text-ink-600">
          직무맵, 준비 체크리스트, 면접 Q뱅크, 미니 프로젝트 템플릿을 제공합니다.
          기업 내부정보나 전형 유출 정보는 다루지 않습니다.
        </p>
        <p className="text-xs text-ink-500">
          직무 구성은 SK hynix 채용 직무 소개의 분류(소자, R&D 공정, 양산기술, 양산기술(P&T), 품질보증, Utility 기술 등)를
          참고해 반도체 엔지니어링 관점으로 재구성했습니다.
        </p>
      </section>

      <PersonaScenario
        steps={[
          {
            title: '직무맵 선택',
            description: '관심 직무를 골라 역할과 요구 역량을 확인합니다.',
            time: '5~10분',
            links: [
              { label: '직무맵', href: '/career/roles' },
              { label: 'R&D 공정', href: '/career/roles/process-engineer' }
            ]
          },
          {
            title: '스킬 체크',
            description: '스킬 매트릭스를 보고 현재 수준을 체크합니다.',
            time: '10~15분',
            links: [
              { label: '준비 체크', href: '/career/checklist' },
              { label: '직무 상세', href: '/career/roles/process-engineer' }
            ]
          },
          {
            title: '질문/프로젝트 연계',
            description: '질문 의도와 프로젝트 템플릿으로 준비 방향을 잡습니다.',
            time: '15~20분',
            links: [
              { label: '면접 Q뱅크', href: '/career/questions' },
              { label: '미니 프로젝트', href: '/career/projects' }
            ]
          },
          {
            title: '체크리스트 정리',
            description: '모든 직무의 준비 상태를 한곳에 정리합니다.',
            time: '5~10분',
            links: [
              { label: '체크리스트', href: '/career/checklist' },
              { label: '진행률', href: '/career/checklist' }
            ]
          }
        ]}
      />

      <RecentViewList section="career" />

      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {roles.slice(0, 4).map((role) => (
            <Link key={role.slug} href={`/career/roles/${role.slug}`} className="card hover:border-accent-500">
              <h2 className="section-title">{role.title}</h2>
              <p className="mt-2 text-sm text-ink-600">{role.one_line}</p>
            </Link>
          ))}
        </div>
        <CareerProgressWidget roles={roles} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/career/roles" className="card">
          <h3 className="section-title">직무맵</h3>
          <p className="mt-2 text-sm text-ink-600">직무별 역할과 준비 항목을 정리합니다.</p>
        </Link>
        <Link href="/career/questions" className="card">
          <h3 className="section-title">면접 Q뱅크</h3>
          <p className="mt-2 text-sm text-ink-600">질문 의도와 답변 구조를 제공합니다.</p>
        </Link>
        <Link href="/career/projects" className="card">
          <h3 className="section-title">미니 프로젝트</h3>
          <p className="mt-2 text-sm text-ink-600">포트폴리오에 활용 가능한 템플릿입니다.</p>
        </Link>
      </section>

      <section className="card flex items-center justify-between">
        <div>
          <h3 className="section-title">나만의 준비 체크리스트</h3>
          <p className="text-sm text-ink-600">모든 직무의 체크/메모를 한곳에서 관리합니다.</p>
        </div>
        <Link href="/career/checklist" className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white">
          체크리스트 보기
        </Link>
      </section>
    </div>
  );
}
