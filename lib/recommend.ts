import type { Audience } from './schema';

export type Recommendable = {
  slug: string;
  title?: string;
  term?: string;
  tags: string[];
  audiences: Audience[];
  updated_at: string;
};

const normalize = (value: string) => value.trim().toLowerCase();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function recencyScore(updatedAt: string) {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return 0;
  const diffDays = (Date.now() - date.getTime()) / MS_PER_DAY;
  const score = 1 - diffDays / 365;
  return Math.max(0, Math.min(1, score));
}

function scoreItem(baseTags: string[], item: Recommendable) {
  const tagMatches = item.tags.map(normalize).filter((tag) => baseTags.includes(tag));
  const tagScore = baseTags.length === 0 ? 0 : (tagMatches.length / baseTags.length) * 4;
  const freshnessScore = recencyScore(item.updated_at) * 2;
  return tagScore + freshnessScore;
}

export function recommendByTags<T extends Recommendable>(
  items: T[],
  baseTags: string[],
  _baseAudiences: Audience[],
  limit: number
): T[] {
  const normalizedTags = baseTags.map(normalize);
  const scored = [...items]
    .map((item) => ({
      item,
      score: scoreItem(normalizedTags, item)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.item.updated_at.localeCompare(a.item.updated_at);
    })
    .slice(0, limit)
    .map((entry) => entry.item);

  if (scored.length >= limit) return scored;

  const remaining = items.filter((item) => !scored.some((selected) => selected.slug === item.slug));

  const tagFallback =
    normalizedTags.length === 0
      ? []
      : remaining
          .filter((item) => item.tags.map(normalize).some((tag) => normalizedTags.includes(tag)))
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  const fallbackPool = remaining
    .filter((item) => !tagFallback.some((candidate) => candidate.slug === item.slug))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  const fallback = [...tagFallback, ...fallbackPool].slice(0, limit - scored.length);

  return [...scored, ...fallback];
}
