import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getCareerRoleBySlug,
  getCareerRoles,
  getCareerProjects,
  getCareerQuestions,
  getGlossary,
  getLearnPaths
} from '@/lib/content';
import SkillMatrixChecklist from '@/components/SkillMatrixChecklist';
import NextCTA from '@/components/NextCTA';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Career Role | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareerRoles().map((role) => ({ slug: role.slug }));
}

export default function CareerRoleDetailPage({ params }: { params: { slug: string } }) {
  const role = getCareerRoleBySlug(params.slug);
  if (!role) return notFound();

  const glossary = getGlossary();
  const learnPaths = getLearnPaths();
  const projects = getCareerProjects();
  const questions = getCareerQuestions();

  const glossaryMap = new Map(glossary.map((item) => [item.slug, item.term]));
  const learnPathMap = new Map(learnPaths.map((item) => [item.slug, item.title]));
  const projectMap = new Map(projects.map((item) => [item.slug, item]));
  const questionMap = new Map(questions.map((item) => [item.slug, item]));

  const relatedProjects = role.related_projects.map((slug) => projectMap.get(slug)).filter(Boolean);
  const relatedQuestions = role.related_questions.map((slug) => questionMap.get(slug)).filter(Boolean);
  const summaryLines = [
    role.one_line,
    role.responsibilities[0] ? `핵심 역할: ${role.responsibilities[0]}` : '핵심 역할: 준비 중',
    `관련 프로젝트 ${relatedProjects.length}개 · 질문 ${relatedQuestions.length}개`
  ];

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `career-role:${role.slug}`,
          title: role.title,
          href: `/career/roles/${role.slug}`,
          type: 'Career Role',
          section: 'career'
        }}
      />
      <SummaryCard
        label="Career Role"
        title={role.title}
        summaryLines={summaryLines}
        tags={role.tags}
        updatedAt={role.updated_at}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">하는 일</h2>
          <ul className="space-y-1 text-sm text-ink-600">
            {role.responsibilities.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">핵심 키워드/용어</h2>
          <div className="flex flex-wrap gap-2 text-xs text-ink-600">
            {role.related_terms.map((slug) => (
              <Link key={slug} href={`/glossary/${slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
                {glossaryMap.get(slug) ?? slug}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">직무 설명</h2>
        <div className="prose max-w-none text-ink-700">
          {role.body ? <MDXRemote source={role.body} /> : <p>직무 설명을 준비 중입니다.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">스킬 매트릭스 + 준비 체크</h2>
        <SkillMatrixChecklist roleSlug={role.slug} matrix={role.skill_matrix} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">공부 로드맵</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {role.related_learn_paths.map((slug) => (
              <Link key={slug} href={`/learn/paths/${slug}`} className="block rounded-lg border border-ink-200/60 px-3 py-2">
                {learnPathMap.get(slug) ?? slug}
              </Link>
            ))}
          </div>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">추천 미니 프로젝트</h2>
          <div className="space-y-2 text-sm text-ink-600">
            {relatedProjects.map((project) => (
              <Link key={project?.slug} href={`/career/projects/${project?.slug}`} className="block rounded-lg border border-ink-200/60 px-3 py-2">
                {project?.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">면접 질문</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {relatedQuestions.map((question) => (
            <Link key={question?.slug} href={`/career/questions/${question?.slug}`} className="card">
              <h3 className="text-base font-semibold text-ink-900">{question?.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{question?.intent_one_line}</p>
            </Link>
          ))}
        </div>
      </section>

      <NextCTA description="면접 Q뱅크에서 더 많은 질문을 확인하세요." href="/career/questions" label="Q뱅크 보기" />
    </div>
  );
}
