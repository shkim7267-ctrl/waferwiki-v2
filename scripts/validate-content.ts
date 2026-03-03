import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { validateFrontmatter } from '../lib/validate';

const ROOT = path.join(process.cwd(), 'content');

type CollectionConfig = {
  name: string;
  dir: string;
  exts: string[];
  minSources: number;
  allowZeroSources?: boolean;
};

const collections: CollectionConfig[] = [
  { name: 'articles', dir: 'articles', exts: ['.mdx'], minSources: 2 },
  { name: 'start', dir: 'start', exts: ['.mdx'], minSources: 2 },
  { name: 'map', dir: 'map', exts: ['.md'], minSources: 2 },
  { name: 'glossary', dir: 'glossary', exts: ['.md'], minSources: 1, allowZeroSources: true },
  { name: 'invest-themes', dir: 'invest/themes', exts: ['.mdx'], minSources: 2 },
  { name: 'invest-companies', dir: 'invest/companies', exts: ['.mdx'], minSources: 2 },
  { name: 'invest-briefs', dir: 'invest/briefs', exts: ['.mdx'], minSources: 2 }
];

async function collectFiles(dir: string, exts: string[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectFiles(fullPath, exts);
      files.push(...nested);
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function run() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const collection of collections) {
    const dir = path.join(ROOT, collection.dir);
    let files: string[] = [];
    try {
      files = await collectFiles(dir, collection.exts);
    } catch {
      continue;
    }

    for (const file of files) {
      const raw = await fs.readFile(file, 'utf-8');
      const { data } = matter(raw);
      const result = validateFrontmatter(file, data, {
        minSources: collection.minSources,
        allowZeroSources: collection.allowZeroSources
      });

      result.errors.forEach((issue) => errors.push(`[${collection.name}] ${issue.file}: ${issue.message}`));
      result.warnings.forEach((issue) => warnings.push(`[${collection.name}] ${issue.file}: ${issue.message}`));
    }
  }

  const eventsDir = path.join(ROOT, 'invest', 'events');
  try {
    const eventFiles = await collectFiles(eventsDir, ['.json']);
    for (const file of eventFiles) {
      const raw = await fs.readFile(file, 'utf-8');
      const data = JSON.parse(raw);
      const list = Array.isArray(data) ? data : [data];
      list.forEach((item, index) => {
        const sources = Array.isArray(item?.sources) ? item.sources : [];
        if (sources.length < 1) {
          errors.push(`[invest-events] ${file}#${index}: sources has ${sources.length}. required >= 1.`);
        }
      });
    }
  } catch {
    // ignore if events missing
  }

  warnings.forEach((message) => console.warn(`WARN: ${message}`));

  if (errors.length > 0) {
    errors.forEach((message) => console.error(`ERROR: ${message}`));
    process.exit(1);
  }

  console.log('Content validation passed.');
}

run();
