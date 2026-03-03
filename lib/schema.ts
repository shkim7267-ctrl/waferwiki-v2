export const AUDIENCES = ['general', 'investor', 'student', 'jobseeker'] as const;
export type Audience = (typeof AUDIENCES)[number];

export type ContentBase = {
  title?: string;
  term?: string;
  summary_3lines?: string[];
  tags: string[];
  audiences: Audience[];
  updated_at: string;
  sources?: string[];
};

export type GlossaryEntry = ContentBase & {
  slug: string;
  term: string;
  one_line: string;
  why_it_matters: string;
  where_it_appears: string;
  related_terms?: string[];
  related_articles?: string[];
};

export type Article = ContentBase & {
  slug: string;
  title: string;
  body: string;
};

export type StartCard = ContentBase & {
  slug: string;
  title: string;
  summary_3lines: string[];
  cta_link: string;
  body: string;
};

export type MapStep = ContentBase & {
  slug: string;
  title: string;
  step: string;
  order: number;
  summary_3lines: string[];
  body: string;
};

// Phase 1~3 (interfaces only)
export type InvestBrief = ContentBase & {
  slug: string;
  title: string;
  period: 'daily' | 'weekly';
  summary_3lines?: string[];
  body?: string;
};

export type LearningPath = ContentBase & {
  slug: string;
  title: string;
  level: 'intro' | 'intermediate';
  steps: LearnPathStep[];
  body?: string;
};

export type CareerRole = ContentBase & {
  slug: string;
  title: string;
  one_line: string;
  responsibilities: string[];
  related_terms: string[];
  related_learn_paths: string[];
  skill_matrix: SkillMatrixCategory[];
  related_questions: string[];
  related_projects: string[];
  body?: string;
};

export type ValueChainItem = {
  layer: string;
  notes: string;
};

export type InvestTheme = ContentBase & {
  slug: string;
  title: string;
  summary_3lines: string[];
  segments: string[];
  value_chain: ValueChainItem[];
  body?: string;
};

export type InvestCompany = ContentBase & {
  slug: string;
  title: string;
  positioning: string[];
  body?: string;
};

export type InvestEvent = {
  date: string;
  entity_type: 'theme' | 'company';
  entity_slug: string;
  title: string;
  one_line: string;
  sources: string[];
};

export type SkillMatrixCategory = {
  category: 'Device' | 'Process' | 'Data' | 'Stats' | 'Tools' | string;
  level_required: 'basic' | 'intermediate' | 'advanced';
  items: string[];
};

export type CareerQuestion = ContentBase & {
  slug: string;
  title: string;
  intent_one_line: string;
  answer_framework: string[];
  pitfalls: string[];
  related_terms: string[];
  body?: string;
};

export type CareerProject = ContentBase & {
  slug: string;
  title: string;
  goal_one_line: string;
  expected_output: string;
  steps: string[];
  evaluation_criteria: string[];
  related_terms: string[];
  body?: string;
};

export type LearnPathStep = {
  id: string;
  title: string;
  goal_one_line: string;
  related_articles: string[];
  related_terms: string[];
  related_map_steps: string[];
};

export type LearnConcept = ContentBase & {
  slug: string;
  title: string;
  one_line: string;
  prereq_concepts: string[];
  next_concepts: string[];
  body?: string;
};

export type LearnQuizQuestion = {
  q: string;
  choices: string[];
  answer_index: number;
  explanation_one_line: string;
  related_terms: string[];
};

export type LearnQuiz = {
  slug: string;
  title: string;
  audiences: Audience[];
  tags: string[];
  questions: LearnQuizQuestion[];
};

export type InvestBriefCardProps = {
  brief: InvestBrief;
};

export type LearningPathCardProps = {
  path: LearningPath;
};

export type CareerRoleCardProps = {
  role: CareerRole;
};
