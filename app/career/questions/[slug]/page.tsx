import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getCareerQuestionBySlug, getCareerQuestions, getGlossary } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Career Question | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareerQuestions().map((question) => ({ slug: question.slug }));
}

export default function CareerQuestionDetailPage({ params }: { params: { slug: string } }) {
  const question = getCareerQuestionBySlug(params.slug);
  if (!question) return notFound();

  const glossary = getGlossary();
  const glossaryMap = new Map(glossary.map((item) => [item.slug, item.term]));
  const summaryLines = [
    question.intent_one_line,
    `답변 구조 ${question.answer_framework.length}단계`,
    `피해야 할 함정 ${question.pitfalls.length}개`
  ];

  return (
    <div className="space-y-10">
      <RecentViewTracker
        item={{
          id: `career-question:${question.slug}`,
          title: question.title,
          href: `/career/questions/${question.slug}`,
          type: 'Career Question',
          section: 'career'
        }}
      />
      <SummaryCard
        label="Interview Question"
        title={question.title}
        summaryLines={summaryLines}
        tags={question.tags}
        updatedAt={question.updated_at}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">좋은 답의 구조</h2>
          <ul className="space-y-1 text-sm text-ink-600">
            {question.answer_framework.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="card space-y-2">
          <h2 className="section-title">피해야 할 함정</h2>
          <ul className="space-y-1 text-sm text-ink-600">
            {question.pitfalls.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">추가 가이드</h2>
        <div className="prose max-w-none text-ink-700">
          {question.body ? <MDXRemote source={question.body} /> : <p>질문 해설을 준비 중입니다.</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="section-title">관련 용어</h2>
        <div className="flex flex-wrap gap-2 text-xs text-ink-600">
          {question.related_terms.map((slug) => (
            <Link key={slug} href={`/glossary/${slug}`} className="rounded-full border border-ink-200/60 px-3 py-1">
              {glossaryMap.get(slug) ?? slug}
            </Link>
          ))}
        </div>
      </section>

      <NextCTA description="미니 프로젝트 템플릿으로 연습해보세요." href="/career/projects" label="프로젝트 보기" />
    </div>
  );
}
