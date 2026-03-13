import fs from 'node:fs';
import path from 'node:path';

export type LearnTrail = {
  id: string;
  title: string;
  concepts: string[];
};

export function getLearnTrails(): LearnTrail[] {
  const file = path.join(process.cwd(), 'content', 'learn', 'trails.json');
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw) as LearnTrail[];
  return Array.isArray(data) ? data : [];
}
