import FlexSearch from 'flexsearch';
export type SearchDoc = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  audiences: string[];
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
  query: string
) {
  if (!query.trim()) return [] as SearchDoc[];
  const results = index.search(query, 20) as string[];
  return results.map((id) => map.get(id)).filter((doc): doc is SearchDoc => Boolean(doc));
}
