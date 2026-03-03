import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getCareerProjectBySlug, getCareerProjects, getGlossary } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import SourceNotice from '@/components/SourceNotice';
import SourceSummaryCard from '@/components/SourceSummaryCard';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Career Project | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareerProjects().map((project) => ({ slug: project.slug }));
}

export default function CareerProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getCareerProjectBySlug(params.slug);
  if (!project) return notFound();

  const glossary = getGlossary();
  const glossaryMap = new Map(glossary.map((item) => [item.slug, item.term]));
  const summaryLines = [
    project.goal_one_line,
    `기대 산출물: ${project.expected_output}`,
    `평가 기준 ${project.evaluation_criteria.length}개`
  ];

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `career-project:${project.slug}`,
          title: project.title,
          href: `/career/projects/${project.slug}`,
          type: 'Career Project',
          section: 'career'
        }}
      />
      <SummaryCard
        label="Mini Project"
        title={project.title}
        summaryLines={summaryLines}
        tags={project.tags}
        updatedAt={project.updated_at}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SourceNotice
          sources={project.sources}
          recommendedSources={1}
          note="프로젝트 템플릿은 경험 기반이어도 가능합니다. 회사/제도/수치 관련 내용에는 출처를 권장합니다."
        />
        <SourceSummaryCard sources={project.sources} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">기대 산출물</h2>
          <p className="text-sm text-ink-600">{project.expected_output}</p>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">평가 기준</h2>
          <ul className="space-y-1 text-sm text-ink-600">
            {project.evaluation_criteria.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card space-y-2">
        <h2 className="section-title">진행 단계</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-600">
          {project.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">추가 가이드</h2>
        <div className="prose max-w-none text-ink-700">
          {project.body ? <MDXRemote source={project.body} /> : <p>프로젝트 가이드를 준비 중입니다.</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="section-title">관련 용어</h2>
        <div className="flex flex-wrap gap-2 text-xs text-ink-600">
          {project.related_terms.map((slug) => (
            <Link key={slug} href={`/glossary/${slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
              {glossaryMap.get(slug) ?? slug}
            </Link>
          ))}
        </div>
      </section>

      <NextCTA description="직무맵으로 돌아가 준비 항목을 확인하세요." href="/career/roles" label="직무맵 보기" />
    </div>
  );
}
