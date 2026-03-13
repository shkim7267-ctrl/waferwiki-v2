import type { LearnConcept } from '@/lib/schema';

export type LearnGraphNode = {
  id: string;
  name: string;
  domain: LearnConcept['domain'];
  degree: number;
  core: boolean;
};

export type LearnGraphLink = {
  source: string;
  target: string;
  type: 'prereq' | 'related';
};

export type LearnGraph = {
  nodes: LearnGraphNode[];
  links: LearnGraphLink[];
};

export function buildLearnGraph(concepts: LearnConcept[]): LearnGraph {
  const links: LearnGraphLink[] = [];
  const linkSet = new Set<string>();

  const addLink = (source: string, target: string, type: LearnGraphLink['type']) => {
    if (!source || !target || source === target) return;
    const key = `${source}::${target}::${type}`;
    if (linkSet.has(key)) return;
    linkSet.add(key);
    links.push({ source, target, type });
  };

  concepts.forEach((concept) => {
    concept.prereq_concepts?.forEach((prereq) => addLink(prereq, concept.slug, 'prereq'));
    concept.related_concepts?.forEach((related) => {
      addLink(concept.slug, related, 'related');
      addLink(related, concept.slug, 'related');
    });
  });

  const degree = new Map<string, number>();
  links.forEach((link) => {
    degree.set(link.source, (degree.get(link.source) ?? 0) + 1);
    degree.set(link.target, (degree.get(link.target) ?? 0) + 1);
  });

  const nodes = concepts.map((concept) => ({
    id: concept.slug,
    name: concept.title,
    domain: concept.domain ?? 'process',
    degree: degree.get(concept.slug) ?? 0,
    core: (degree.get(concept.slug) ?? 0) >= 5
  }));

  return { nodes, links };
}
