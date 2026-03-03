import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLearnQuizBySlug, getLearnQuizzes } from '@/lib/content';
import QuizRunner from '@/components/QuizRunner';
import NextCTA from '@/components/NextCTA';
import RecentViewTracker from '@/components/RecentViewTracker';

export const metadata = {
  title: 'Learn Quiz | WaferWiki v2'
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLearnQuizzes().map((quiz) => ({ slug: quiz.slug }));
}

export default function LearnQuizDetailPage({ params }: { params: { slug: string } }) {
  const quiz = getLearnQuizBySlug(params.slug);
  if (!quiz) return notFound();

  return (
    <div className="space-y-8">
      <RecentViewTracker
        item={{
          id: `learn-quiz:${quiz.slug}`,
          title: quiz.title,
          href: `/learn/quiz/${quiz.slug}`,
          type: 'Learn Quiz',
          section: 'learn'
        }}
      />
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Quiz</p>
        <h1 className="text-3xl font-semibold text-ink-900">{quiz.title}</h1>
        <div className="flex flex-wrap gap-2 text-xs text-ink-500">
          {quiz.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <QuizRunner questions={quiz.questions} />

      <NextCTA description="개념 카드로 이동해 학습을 이어가세요." href="/learn/concepts" label="개념 카드 보기" />
    </div>
  );
}
