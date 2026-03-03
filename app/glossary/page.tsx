import Link from 'next/link';
import GlossaryList from '@/components/GlossaryList';
import NextCTA from '@/components/NextCTA';
import RecentViewList from '@/components/RecentViewList';
import {
  getArticles,
  getGlossary,
  getInvestThemes,
  getInvestCompanies,
  getInvestBriefs,
  getLearnPaths,
  getLearnConcepts,
  getLearnQuizzes,
  getCareerRoles,
  getCareerQuestions,
  getCareerProjects
} from '@/lib/content';

export const metadata = {
  title: '쉬운 용어사전 | WaferWiki v2'
};

export default function GlossaryPage() {
  const glossary = getGlossary();
  const articles = getArticles();
  const investThemes = getInvestThemes();
  const investCompanies = getInvestCompanies();
  const investBriefs = getInvestBriefs();
  const learnPaths = getLearnPaths();
  const learnConcepts = getLearnConcepts();
  const learnQuizzes = getLearnQuizzes();
  const careerRoles = getCareerRoles();
  const careerQuestions = getCareerQuestions();
  const careerProjects = getCareerProjects();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">쉬운 용어사전</h1>
        <p className="text-sm text-ink-600">용어 정의와 등장 맥락을 빠르게 확인할 수 있습니다.</p>
      </section>

      <RecentViewList section="glossary" />

      <GlossaryList
        glossary={glossary}
        articles={articles}
        investThemes={investThemes}
        investCompanies={investCompanies}
        investBriefs={investBriefs}
        learnPaths={learnPaths}
        learnConcepts={learnConcepts}
        learnQuizzes={learnQuizzes}
        careerRoles={careerRoles}
        careerQuestions={careerQuestions}
        careerProjects={careerProjects}
      />

      <NextCTA description="입문 글로 개념을 조금 더 깊게 이해해보세요." href="/articles" label="입문 글 보기" />
    </div>
  );
}
