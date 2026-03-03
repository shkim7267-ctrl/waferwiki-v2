import CareerQuestionsList from '@/components/CareerQuestionsList';
import { getCareerQuestions } from '@/lib/content';

export const metadata = {
  title: 'Career Questions | WaferWiki v2'
};

export default function CareerQuestionsPage() {
  const questions = getCareerQuestions();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">면접 Q뱅크</h1>
        <p className="text-sm text-ink-600">질문 의도와 답변 구조를 확인합니다.</p>
      </section>

      <CareerQuestionsList questions={questions} />
    </div>
  );
}
