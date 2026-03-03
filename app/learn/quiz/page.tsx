import LearnQuizList from '@/components/LearnQuizList';
import { getLearnQuizzes } from '@/lib/content';

export const metadata = {
  title: 'Learn Quiz | WaferWiki v2'
};

export default function LearnQuizPage() {
  const quizzes = getLearnQuizzes();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">퀴즈 허브</h1>
        <p className="text-sm text-ink-600">핵심 개념을 점검하는 간단 퀴즈입니다.</p>
      </section>

      <LearnQuizList quizzes={quizzes} />
    </div>
  );
}
