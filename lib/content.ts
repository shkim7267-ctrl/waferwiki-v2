import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {
  Article,
  GlossaryEntry,
  MapStep,
  StartCard,
  Audience,
  InvestTheme,
  InvestCompany,
  InvestBrief,
  InvestEvent,
  ValueChainItem,
  LearningPath,
  LearnPathStep,
  LearnConcept,
  LearnQuiz,
  LearnQuizQuestion,
  CareerRole,
  SkillMatrixCategory,
  CareerQuestion,
  CareerProject
} from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type Frontmatter = Record<string, unknown>;

function listFiles(dir: string, ext: string) {
  const files = fs.readdirSync(dir);
  return files
    .filter((file) => file.endsWith(ext))
    .map((file) => path.join(dir, file));
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item));
  return [String(value)];
}

function toAudienceArray(value: unknown): Audience[] {
  return toStringArray(value) as Audience[];
}

function getSlug(data: Frontmatter, fallback: string) {
  const raw = data.slug ? String(data.slug) : fallback;
  return raw.trim();
}

function toValueChain(value: unknown): ValueChainItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const layer = String((item as { layer?: string }).layer ?? '');
      const notes = String((item as { notes?: string }).notes ?? '');
      if (!layer || !notes) return null;
      return { layer, notes };
    })
    .filter((item): item is ValueChainItem => Boolean(item));
}

function toLearnSteps(value: unknown): LearnPathStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const raw = item as Record<string, unknown>;
      const id = String(raw.id ?? '');
      const title = String(raw.title ?? '');
      const goal = String(raw.goal_one_line ?? '');
      if (!id || !title || !goal) return null;
      return {
        id,
        title,
        goal_one_line: goal,
        related_articles: toStringArray(raw.related_articles),
        related_terms: toStringArray(raw.related_terms),
        related_map_steps: toStringArray(raw.related_map_steps)
      } satisfies LearnPathStep;
    })
    .filter((item): item is LearnPathStep => Boolean(item));
}

function toQuizQuestions(value: unknown): LearnQuizQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const raw = item as Record<string, unknown>;
      return {
        q: String(raw.q ?? ''),
        choices: toStringArray(raw.choices),
        answer_index: Number(raw.answer_index ?? 0),
        explanation_one_line: String(raw.explanation_one_line ?? ''),
        related_terms: toStringArray(raw.related_terms)
      } satisfies LearnQuizQuestion;
    })
    .filter((item): item is LearnQuizQuestion => Boolean(item?.q));
}

function toSkillMatrix(value: unknown): SkillMatrixCategory[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const raw = item as Record<string, unknown>;
      const category = String(raw.category ?? '');
      const level = String(raw.level_required ?? 'basic') as SkillMatrixCategory['level_required'];
      const items = toStringArray(raw.items);
      if (!category || items.length === 0) return null;
      return { category, level_required: level, items } satisfies SkillMatrixCategory;
    })
    .filter((item): item is SkillMatrixCategory => Boolean(item));
}

function parseFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { data: data as Frontmatter, content };
}

export function getGlossary(): GlossaryEntry[] {
  const dir = path.join(CONTENT_DIR, 'glossary');
  const files = listFiles(dir, '.md');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.md'));
      return {
        slug,
        term: String(data.term ?? ''),
        one_line: String(data.one_line ?? ''),
        why_it_matters: String(data.why_it_matters ?? ''),
        where_it_appears: String(data.where_it_appears ?? ''),
        tags: toStringArray(data.tags),
        related_terms: toStringArray(data.related_terms),
        related_articles: toStringArray(data.related_articles),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies GlossaryEntry;
    })
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function getGlossaryBySlug(slug: string): GlossaryEntry | undefined {
  const file = path.join(CONTENT_DIR, 'glossary', `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    term: String(data.term ?? ''),
    one_line: String(data.one_line ?? ''),
    why_it_matters: String(data.why_it_matters ?? ''),
    where_it_appears: String(data.where_it_appears ?? ''),
    tags: toStringArray(data.tags),
    related_terms: toStringArray(data.related_terms),
    related_articles: toStringArray(data.related_articles),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies GlossaryEntry;
}

export function getArticles(): Article[] {
  const dir = path.join(CONTENT_DIR, 'articles');
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        summary_3lines: toStringArray(data.summary_3lines),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies Article;
    })
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getArticleBySlug(slug: string): Article | undefined {
  const file = path.join(CONTENT_DIR, 'articles', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    summary_3lines: toStringArray(data.summary_3lines),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies Article;
}

export function getStartCards(): StartCard[] {
  const dir = path.join(CONTENT_DIR, 'start');
  const files = listFiles(dir, '.mdx');
  return files.map((file) => {
    const { data, content } = parseFile(file);
    const slug = getSlug(data, path.basename(file, '.mdx'));
    return {
      slug,
      title: String(data.title ?? ''),
      summary_3lines: toStringArray(data.summary_3lines),
      cta_link: String(data.cta_link ?? ''),
      tags: toStringArray(data.tags),
      audiences: toAudienceArray(data.audiences),
      updated_at: String(data.updated_at ?? ''),
      sources: toStringArray(data.sources),
      body: content
    } satisfies StartCard;
  });
}

export function getMapSteps(): MapStep[] {
  const dir = path.join(CONTENT_DIR, 'map');
  const files = listFiles(dir, '.md');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.md'));
      return {
        slug,
        title: String(data.title ?? ''),
        step: String(data.step ?? ''),
        order: Number(data.order ?? 0),
        summary_3lines: toStringArray(data.summary_3lines),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        key_points: toStringArray(data.key_points),
        common_issues: toStringArray(data.common_issues),
        measurements: toStringArray(data.measurements),
        handoff: toStringArray(data.handoff),
        body: content
      } satisfies MapStep;
    })
    .sort((a, b) => a.order - b.order);
}

export function getInvestThemes(): InvestTheme[] {
  const dir = path.join(CONTENT_DIR, 'invest', 'themes');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        summary_3lines: toStringArray(data.summary_3lines),
        tags: toStringArray(data.tags),
        segments: toStringArray(data.segments),
        value_chain: toValueChain(data.value_chain),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies InvestTheme;
    })
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getInvestThemeBySlug(slug: string): InvestTheme | undefined {
  const file = path.join(CONTENT_DIR, 'invest', 'themes', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    summary_3lines: toStringArray(data.summary_3lines),
    tags: toStringArray(data.tags),
    segments: toStringArray(data.segments),
    value_chain: toValueChain(data.value_chain),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies InvestTheme;
}

export function getInvestCompanies(): InvestCompany[] {
  const dir = path.join(CONTENT_DIR, 'invest', 'companies');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        positioning: toStringArray(data.positioning),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies InvestCompany;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getInvestCompanyBySlug(slug: string): InvestCompany | undefined {
  const file = path.join(CONTENT_DIR, 'invest', 'companies', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    positioning: toStringArray(data.positioning),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies InvestCompany;
}

export function getInvestBriefs(): InvestBrief[] {
  const dir = path.join(CONTENT_DIR, 'invest', 'briefs');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        period: (data.period as InvestBrief['period']) ?? 'weekly',
        summary_3lines: toStringArray(data.summary_3lines),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies InvestBrief;
    })
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getInvestBriefBySlug(slug: string): InvestBrief | undefined {
  const file = path.join(CONTENT_DIR, 'invest', 'briefs', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    period: (data.period as InvestBrief['period']) ?? 'weekly',
    summary_3lines: toStringArray(data.summary_3lines),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies InvestBrief;
}

export function getInvestEvents(): InvestEvent[] {
  const dir = path.join(CONTENT_DIR, 'invest', 'events');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));
  const events: InvestEvent[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : [data];
    list.forEach((item) => {
      if (!item) return;
      events.push({
        date: String(item.date ?? ''),
        entity_type: String(item.entity_type ?? '') as InvestEvent['entity_type'],
        entity_slug: String(item.entity_slug ?? ''),
        title: String(item.title ?? ''),
        one_line: String(item.one_line ?? ''),
        sources: toStringArray(item.sources)
      });
    });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export function getInvestEventsFor(entityType: InvestEvent['entity_type'], slug: string) {
  return getInvestEvents().filter((event) => event.entity_type === entityType && event.entity_slug === slug);
}

export function getLearnPaths(): LearningPath[] {
  const dir = path.join(CONTENT_DIR, 'learn', 'paths');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        level: (data.level as LearningPath['level']) ?? 'intro',
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        steps: toLearnSteps(data.steps),
        body: content
      } satisfies LearningPath;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getLearnPathBySlug(slug: string): LearningPath | undefined {
  const file = path.join(CONTENT_DIR, 'learn', 'paths', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    level: (data.level as LearningPath['level']) ?? 'intro',
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    steps: toLearnSteps(data.steps),
    body: content
  } satisfies LearningPath;
}

export function getLearnConcepts(): LearnConcept[] {
  const dir = path.join(CONTENT_DIR, 'learn', 'concepts');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        one_line: String(data.one_line ?? ''),
        domain: (data.domain as LearnConcept['domain']) ?? 'process',
        prereq_concepts: toStringArray(data.prereq_concepts),
        next_concepts: toStringArray(data.next_concepts),
        related_concepts: toStringArray(data.related_concepts),
        resources: Array.isArray(data.resources)
          ? data.resources
              .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const raw = item as Record<string, unknown>;
                return {
                  type: (raw.type as 'article' | 'video') ?? 'article',
                  title: String(raw.title ?? ''),
                  url: String(raw.url ?? ''),
                  source: String(raw.source ?? '')
                };
              })
              .filter((item): item is LearnConcept['resources'][number] => Boolean(item?.title && item?.url))
          : [],
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies LearnConcept;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getLearnConceptBySlug(slug: string): LearnConcept | undefined {
  const file = path.join(CONTENT_DIR, 'learn', 'concepts', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    one_line: String(data.one_line ?? ''),
    domain: (data.domain as LearnConcept['domain']) ?? 'process',
    prereq_concepts: toStringArray(data.prereq_concepts),
    next_concepts: toStringArray(data.next_concepts),
    related_concepts: toStringArray(data.related_concepts),
    resources: Array.isArray(data.resources)
      ? data.resources
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const raw = item as Record<string, unknown>;
            return {
              type: (raw.type as 'article' | 'video') ?? 'article',
              title: String(raw.title ?? ''),
              url: String(raw.url ?? ''),
              source: String(raw.source ?? '')
            };
          })
          .filter((item): item is LearnConcept['resources'][number] => Boolean(item?.title && item?.url))
      : [],
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies LearnConcept;
}

export function getLearnQuizzes(): LearnQuiz[] {
  const dir = path.join(CONTENT_DIR, 'learn', 'quiz');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const data = JSON.parse(raw);
    return {
      slug: String(data.slug ?? path.basename(file, '.json')),
      title: String(data.title ?? ''),
      audiences: toAudienceArray(data.audiences),
      tags: toStringArray(data.tags),
      questions: toQuizQuestions(data.questions)
    } satisfies LearnQuiz;
  });
}

export function getLearnQuizBySlug(slug: string): LearnQuiz | undefined {
  const dir = path.join(CONTENT_DIR, 'learn', 'quiz');
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  return {
    slug: String(data.slug ?? slug),
    title: String(data.title ?? ''),
    audiences: toAudienceArray(data.audiences),
    tags: toStringArray(data.tags),
    questions: toQuizQuestions(data.questions)
  } satisfies LearnQuiz;
}

export function getCareerRoles(): CareerRole[] {
  const dir = path.join(CONTENT_DIR, 'career', 'roles');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files
    .map((file) => {
      const { data, content } = parseFile(file);
      const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        one_line: String(data.one_line ?? ''),
        responsibilities: toStringArray(data.responsibilities),
        related_terms: toStringArray(data.related_terms),
        related_learn_paths: toStringArray(data.related_learn_paths),
        skill_matrix: toSkillMatrix(data.skill_matrix),
        related_questions: toStringArray(data.related_questions),
        related_projects: toStringArray(data.related_projects),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies CareerRole;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCareerRoleBySlug(slug: string): CareerRole | undefined {
  const file = path.join(CONTENT_DIR, 'career', 'roles', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    one_line: String(data.one_line ?? ''),
    responsibilities: toStringArray(data.responsibilities),
    related_terms: toStringArray(data.related_terms),
    related_learn_paths: toStringArray(data.related_learn_paths),
    skill_matrix: toSkillMatrix(data.skill_matrix),
    related_questions: toStringArray(data.related_questions),
    related_projects: toStringArray(data.related_projects),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies CareerRole;
}

export function getCareerQuestions(): CareerQuestion[] {
  const dir = path.join(CONTENT_DIR, 'career', 'questions');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files.map((file) => {
    const { data, content } = parseFile(file);
    const slug = getSlug(data, path.basename(file, '.mdx'));
      return {
        slug,
        title: String(data.title ?? ''),
        intent_one_line: String(data.intent_one_line ?? ''),
        answer_framework: toStringArray(data.answer_framework),
        pitfalls: toStringArray(data.pitfalls),
        related_terms: toStringArray(data.related_terms),
        tags: toStringArray(data.tags),
        audiences: toAudienceArray(data.audiences),
        updated_at: String(data.updated_at ?? ''),
        sources: toStringArray(data.sources),
        body: content
      } satisfies CareerQuestion;
  });
}

export function getCareerQuestionBySlug(slug: string): CareerQuestion | undefined {
  const file = path.join(CONTENT_DIR, 'career', 'questions', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    intent_one_line: String(data.intent_one_line ?? ''),
    answer_framework: toStringArray(data.answer_framework),
    pitfalls: toStringArray(data.pitfalls),
    related_terms: toStringArray(data.related_terms),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies CareerQuestion;
}

export function getCareerProjects(): CareerProject[] {
  const dir = path.join(CONTENT_DIR, 'career', 'projects');
  if (!fs.existsSync(dir)) return [];
  const files = listFiles(dir, '.mdx');
  return files.map((file) => {
    const { data, content } = parseFile(file);
    const slug = getSlug(data, path.basename(file, '.mdx'));
    return {
      slug,
      title: String(data.title ?? ''),
      goal_one_line: String(data.goal_one_line ?? ''),
      expected_output: String(data.expected_output ?? ''),
      steps: toStringArray(data.steps),
      evaluation_criteria: toStringArray(data.evaluation_criteria),
      related_terms: toStringArray(data.related_terms),
      tags: toStringArray(data.tags),
      audiences: toAudienceArray(data.audiences),
      updated_at: String(data.updated_at ?? ''),
      sources: toStringArray(data.sources),
      body: content
    } satisfies CareerProject;
  });
}

export function getCareerProjectBySlug(slug: string): CareerProject | undefined {
  const file = path.join(CONTENT_DIR, 'career', 'projects', `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = parseFile(file);
  return {
    slug: getSlug(data, slug),
    title: String(data.title ?? ''),
    goal_one_line: String(data.goal_one_line ?? ''),
    expected_output: String(data.expected_output ?? ''),
    steps: toStringArray(data.steps),
    evaluation_criteria: toStringArray(data.evaluation_criteria),
    related_terms: toStringArray(data.related_terms),
    tags: toStringArray(data.tags),
    audiences: toAudienceArray(data.audiences),
    updated_at: String(data.updated_at ?? ''),
    sources: toStringArray(data.sources),
    body: content
  } satisfies CareerProject;
}
