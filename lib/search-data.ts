import type { SearchDoc } from './search';
import {
  getArticles,
  getGlossary,
  getInvestThemes,
  getInvestBriefs,
  getLearnPaths,
  getLearnConcepts,
  getLearnQuizzes,
  getCareerRoles,
  getCareerQuestions,
  getCareerProjects
} from './content';

export function getSearchDocs(): SearchDoc[] {
  const glossary = getGlossary();
  const articles = getArticles();
  const investThemes = getInvestThemes();
  const investBriefs = getInvestBriefs();
  const learnPaths = getLearnPaths();
  const learnConcepts = getLearnConcepts();
  const learnQuizzes = getLearnQuizzes();
  const careerRoles = getCareerRoles();
  const careerQuestions = getCareerQuestions();
  const careerProjects = getCareerProjects();

  return [
    ...glossary.map((item) => ({
      id: `g-${item.slug}`,
      title: item.term,
      summary: item.one_line,
      tags: item.tags,
      audiences: item.audiences,
      type: 'glossary' as const,
      href: `/glossary/${item.slug}`
    })),
    ...articles.map((item) => ({
      id: `a-${item.slug}`,
      title: item.title,
      summary: item.summary_3lines?.[0] ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'article' as const,
      href: `/articles/${item.slug}`
    })),
    ...investThemes.map((item) => ({
      id: `it-${item.slug}`,
      title: item.title,
      summary: item.summary_3lines?.[0] ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'invest-theme' as const,
      href: `/invest/themes/${item.slug}`
    })),
    ...investBriefs.map((item) => ({
      id: `ib-${item.slug}`,
      title: item.title,
      summary: item.summary_3lines?.[0] ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'invest-brief' as const,
      href: `/invest/briefs/${item.slug}`
    })),
    ...learnPaths.map((item) => ({
      id: `lp-${item.slug}`,
      title: item.title,
      summary: item.steps?.[0]?.goal_one_line ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'learn-path' as const,
      href: `/learn/paths/${item.slug}`
    })),
    ...learnConcepts.map((item) => ({
      id: `lc-${item.slug}`,
      title: item.title,
      summary: item.one_line ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'learn-concept' as const,
      href: `/learn/concepts/${item.slug}`
    })),
    ...learnQuizzes.map((item) => ({
      id: `lq-${item.slug}`,
      title: item.title,
      summary: item.questions?.[0]?.q ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'learn-quiz' as const,
      href: `/learn/quiz/${item.slug}`
    })),
    ...careerRoles.map((item) => ({
      id: `cr-${item.slug}`,
      title: item.title,
      summary: item.one_line ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'career-role' as const,
      href: `/career/roles/${item.slug}`
    })),
    ...careerQuestions.map((item) => ({
      id: `cq-${item.slug}`,
      title: item.title,
      summary: item.intent_one_line ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'career-question' as const,
      href: `/career/questions/${item.slug}`
    })),
    ...careerProjects.map((item) => ({
      id: `cp-${item.slug}`,
      title: item.title,
      summary: item.goal_one_line ?? '',
      tags: item.tags,
      audiences: item.audiences,
      type: 'career-project' as const,
      href: `/career/projects/${item.slug}`
    }))
  ];
}
