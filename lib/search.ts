import FlexSearch from 'flexsearch';
import type { Audience } from './schema';

export type SearchDoc = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  audiences: Audience[];
  type:
    | 'glossary'
    | 'article'
    | 'invest-theme'
    | 'invest-company'
    | 'invest-brief'
    | 'learn-path'
    | 'learn-concept'
    | 'learn-quiz'
    | 'career-role'
    | 'career-question'
    | 'career-project';
  href: string;
};

export function buildSearchIndex(docs: SearchDoc[]) {
  const index = new FlexSearch.Index({
    tokenize: 'forward',
    cache: true,
    context: true
  });
  const map = new Map<string, SearchDoc>();

  docs.forEach((doc) => {
    const text = [doc.title, doc.summary ?? '', doc.tags.join(' ')].join(' ');
    index.add(doc.id, text);
    map.set(doc.id, doc);
  });

  return { index, map };
}

export function searchDocs(
  index: FlexSearch.Index,
  map: Map<string, SearchDoc>,
  query: string,
  audience: Audience
) {
  if (!query.trim()) return [] as SearchDoc[];
  const results = index.search(query, 20) as string[];
  const filtered = results
    .map((id) => map.get(id))
    .filter((doc): doc is SearchDoc => Boolean(doc))
    .filter((doc) => doc.audiences.includes(audience));

  if (audience === 'student') {
    const priority: Record<SearchDoc['type'], number> = {
      'learn-path': 0,
      'learn-concept': 1,
      'learn-quiz': 2,
      'career-role': 3,
      'career-question': 4,
      'career-project': 5,
      glossary: 3,
      article: 4,
      'invest-theme': 5,
      'invest-company': 6,
      'invest-brief': 7
    };
    return [...filtered].sort((a, b) => priority[a.type] - priority[b.type]);
  }

  if (audience === 'jobseeker') {
    const priority: Record<SearchDoc['type'], number> = {
      'career-role': 0,
      'career-question': 1,
      'career-project': 2,
      glossary: 3,
      article: 4,
      'learn-path': 5,
      'learn-concept': 6,
      'learn-quiz': 7,
      'invest-theme': 8,
      'invest-company': 9,
      'invest-brief': 10
    };
    return [...filtered].sort((a, b) => priority[a.type] - priority[b.type]);
  }

  return filtered;
}
