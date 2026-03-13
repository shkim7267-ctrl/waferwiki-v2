const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const base = path.join(process.cwd(), 'content', 'learn', 'concepts');

const video = {
  general: {
    title: 'Semiconductor Manufacturing Process (All About Semiconductor)',
    url: 'https://www.youtube.com/watch?v=Bu52CE55BN0',
    source: 'YouTube'
  },
  transistor: {
    title: 'How Do Transistors Work?',
    url: 'https://www.youtube.com/watch?v=IcrBqCFLHIY',
    source: 'YouTube'
  },
  euv: {
    title: 'High-NA EUV Lithography Explained',
    url: 'https://www.youtube.com/watch?v=i9oLk-vxZpA',
    source: 'YouTube'
  },
  ald: {
    title: 'Atomic Layer Deposition (ALD) Basics',
    url: 'https://www.youtube.com/watch?v=URsOBG0l2hw',
    source: 'YouTube'
  },
  packaging: {
    title: 'Semiconductor Packaging - Structure Overview',
    url: 'https://www.youtube.com/watch?v=tRT6-Ph3V28',
    source: 'YouTube'
  },
  hbm: {
    title: 'HBM Memory Module Overview',
    url: 'https://www.youtube.com/watch?v=KyKwiziPmD4',
    source: 'YouTube'
  }
};

const article = {
  semiconductor: {
    title: 'Semiconductor (overview)',
    url: 'https://en.wikipedia.org/wiki/Semiconductor',
    source: 'Wikipedia'
  },
  wafer: {
    title: 'Wafer (electronics)',
    url: 'https://en.wikipedia.org/wiki/Wafer_(electronics)',
    source: 'Wikipedia'
  },
  materials: {
    title: 'Semiconductor material',
    url: 'https://en.wikipedia.org/wiki/Semiconductor_material',
    source: 'Wikipedia'
  },
  lithography: {
    title: 'Photolithography',
    url: 'https://en.wikipedia.org/wiki/Photolithography',
    source: 'Wikipedia'
  },
  etch: {
    title: 'Etching (microfabrication)',
    url: 'https://en.wikipedia.org/wiki/Etching_(microfabrication)',
    source: 'Wikipedia'
  },
  cvd: {
    title: 'Chemical vapor deposition',
    url: 'https://en.wikipedia.org/wiki/Chemical_vapor_deposition',
    source: 'Wikipedia'
  },
  diffusion: {
    title: 'Diffusion (semiconductor)',
    url: 'https://en.wikipedia.org/wiki/Diffusion_(semiconductor)',
    source: 'Wikipedia'
  },
  doping: {
    title: 'Doping (semiconductor)',
    url: 'https://en.wikipedia.org/wiki/Doping_(semiconductor)',
    source: 'Wikipedia'
  },
  implantation: {
    title: 'Ion implantation',
    url: 'https://en.wikipedia.org/wiki/Ion_implantation',
    source: 'Wikipedia'
  },
  photomask: {
    title: 'Photomask',
    url: 'https://en.wikipedia.org/wiki/Photomask',
    source: 'Wikipedia'
  },
  euv: {
    title: 'Extreme ultraviolet lithography',
    url: 'https://en.wikipedia.org/wiki/Extreme_ultraviolet_lithography',
    source: 'Wikipedia'
  },
  highna: {
    title: 'High-NA EUV',
    url: 'https://www.asml.com/en/technology/euv-lithography/high-na-euv',
    source: 'ASML'
  },
  finfet: {
    title: 'FinFET',
    url: 'https://en.wikipedia.org/wiki/Fin_FET',
    source: 'Wikipedia'
  },
  interconnect: {
    title: 'Interconnect (integrated circuits)',
    url: 'https://en.wikipedia.org/wiki/Interconnect_(integrated_circuits)',
    source: 'Wikipedia'
  },
  dram: {
    title: 'Dynamic random-access memory',
    url: 'https://en.wikipedia.org/wiki/Dynamic_random-access_memory',
    source: 'Wikipedia'
  },
  logic: {
    title: 'Logic gate',
    url: 'https://en.wikipedia.org/wiki/Logic_gate',
    source: 'Wikipedia'
  },
  hbm: {
    title: 'High Bandwidth Memory',
    url: 'https://en.wikipedia.org/wiki/High_Bandwidth_Memory',
    source: 'Wikipedia'
  },
  chiplet: {
    title: 'Chiplet',
    url: 'https://en.wikipedia.org/wiki/Chiplet',
    source: 'Wikipedia'
  },
  packaging: {
    title: 'Integrated circuit packaging',
    url: 'https://en.wikipedia.org/wiki/Integrated_circuit_packaging',
    source: 'Wikipedia'
  },
  advancedPackaging: {
    title: '3D integration',
    url: 'https://en.wikipedia.org/wiki/3D_integration',
    source: 'Wikipedia'
  },
  test: {
    title: 'Automatic test equipment',
    url: 'https://en.wikipedia.org/wiki/Automatic_test_equipment',
    source: 'Wikipedia'
  },
  yield: {
    title: 'Yield (engineering)',
    url: 'https://en.wikipedia.org/wiki/Yield_(engineering)',
    source: 'Wikipedia'
  },
  defect: {
    title: 'Defect (engineering)',
    url: 'https://en.wikipedia.org/wiki/Defect_(engineering)',
    source: 'Wikipedia'
  },
  equipment: {
    title: 'Semiconductor manufacturing equipment',
    url: 'https://en.wikipedia.org/wiki/Semiconductor_manufacturing_equipment',
    source: 'Wikipedia'
  },
  quality: {
    title: 'Statistical process control',
    url: 'https://en.wikipedia.org/wiki/Statistical_process_control',
    source: 'Wikipedia'
  },
  supply: {
    title: 'Supply chain',
    url: 'https://en.wikipedia.org/wiki/Supply_chain',
    source: 'Wikipedia'
  },
  roadmap: {
    title: 'Technology roadmap',
    url: 'https://en.wikipedia.org/wiki/Technology_roadmap',
    source: 'Wikipedia'
  },
  capex: {
    title: 'Capital expenditure',
    url: 'https://en.wikipedia.org/wiki/Capital_expenditure',
    source: 'Wikipedia'
  },
  career: {
    title: 'Semiconductor industry',
    url: 'https://en.wikipedia.org/wiki/Semiconductor_industry',
    source: 'Wikipedia'
  },
  eda: {
    title: 'Electronic design automation',
    url: 'https://en.wikipedia.org/wiki/Electronic_design_automation',
    source: 'Wikipedia'
  }
};

const mapping = {
  'semiconductor-basics': {
    domain: 'device',
    related: ['wafer-basics', 'device-structures', 'supply-chain-basics'],
    article: article.semiconductor,
    video: video.general
  },
  'wafer-basics': {
    domain: 'process',
    related: ['lithography-basics', 'deposition-basics', 'defect-basics'],
    article: article.wafer,
    video: video.general
  },
  'materials-basics': {
    domain: 'process',
    related: ['deposition-basics', 'etch-basics', 'quality-basics'],
    article: article.materials,
    video: video.general
  },
  'lithography-basics': {
    domain: 'process',
    related: ['mask-basics', 'euv-basics', 'etch-basics'],
    article: article.lithography,
    video: video.general
  },
  'etch-basics': {
    domain: 'process',
    related: ['lithography-basics', 'deposition-basics', 'defect-basics'],
    article: article.etch,
    video: video.general
  },
  'deposition-basics': {
    domain: 'process',
    related: ['etch-basics', 'interconnect-basics', 'materials-basics'],
    article: article.cvd,
    video: video.ald
  },
  'diffusion-basics': {
    domain: 'process',
    related: ['doping-basics', 'implantation-basics', 'device-structures'],
    article: article.diffusion,
    video: video.general
  },
  'doping-basics': {
    domain: 'process',
    related: ['diffusion-basics', 'implantation-basics', 'device-structures'],
    article: article.doping,
    video: video.general
  },
  'implantation-basics': {
    domain: 'process',
    related: ['doping-basics', 'diffusion-basics', 'device-structures'],
    article: article.implantation,
    video: video.general
  },
  'mask-basics': {
    domain: 'process',
    related: ['lithography-basics', 'euv-basics', 'high-na-basics'],
    article: article.photomask,
    video: video.general
  },
  'euv-basics': {
    domain: 'process',
    related: ['lithography-basics', 'mask-basics', 'high-na-basics'],
    article: article.euv,
    video: video.euv
  },
  'high-na-basics': {
    domain: 'process',
    related: ['euv-basics', 'mask-basics', 'roadmap-basics'],
    article: article.highna,
    video: video.euv
  },
  'device-structures': {
    domain: 'device',
    related: ['logic-basics', 'memory-basics', 'interconnect-basics'],
    article: article.finfet,
    video: video.transistor
  },
  'interconnect-basics': {
    domain: 'device',
    related: ['device-structures', 'packaging-basics', 'yield-basics'],
    article: article.interconnect,
    video: video.general
  },
  'memory-basics': {
    domain: 'device',
    related: ['hbm-basics', 'chiplet-basics', 'interconnect-basics'],
    article: article.dram,
    video: video.transistor
  },
  'logic-basics': {
    domain: 'device',
    related: ['device-structures', 'eda-basics', 'interconnect-basics'],
    article: article.logic,
    video: video.transistor
  },
  'hbm-basics': {
    domain: 'packaging',
    related: ['memory-basics', 'advanced-packaging-basics', 'chiplet-basics'],
    article: article.hbm,
    video: video.hbm
  },
  'chiplet-basics': {
    domain: 'packaging',
    related: ['advanced-packaging-basics', 'interconnect-basics', 'memory-basics'],
    article: article.chiplet,
    video: video.packaging
  },
  'packaging-basics': {
    domain: 'packaging',
    related: ['advanced-packaging-basics', 'test-basics', 'quality-basics'],
    article: article.packaging,
    video: video.packaging
  },
  'advanced-packaging-basics': {
    domain: 'packaging',
    related: ['packaging-basics', 'chiplet-basics', 'hbm-basics'],
    article: article.advancedPackaging,
    video: video.packaging
  },
  'test-basics': {
    domain: 'packaging',
    related: ['yield-basics', 'quality-basics', 'defect-basics'],
    article: article.test,
    video: video.general
  },
  'yield-basics': {
    domain: 'process',
    related: ['defect-basics', 'quality-basics', 'equipment-basics'],
    article: article.yield,
    video: video.general
  },
  'defect-basics': {
    domain: 'process',
    related: ['yield-basics', 'test-basics', 'lithography-basics'],
    article: article.defect,
    video: video.general
  },
  'equipment-basics': {
    domain: 'process',
    related: ['deposition-basics', 'etch-basics', 'lithography-basics'],
    article: article.equipment,
    video: video.general
  },
  'quality-basics': {
    domain: 'process',
    related: ['yield-basics', 'test-basics', 'roadmap-basics'],
    article: article.quality,
    video: video.general
  },
  'supply-chain-basics': {
    domain: 'system',
    related: ['capex-basics', 'roadmap-basics', 'equipment-basics'],
    article: article.supply,
    video: video.general
  },
  'roadmap-basics': {
    domain: 'system',
    related: ['capex-basics', 'high-na-basics', 'supply-chain-basics'],
    article: article.roadmap,
    video: video.general
  },
  'capex-basics': {
    domain: 'system',
    related: ['roadmap-basics', 'supply-chain-basics', 'equipment-basics'],
    article: article.capex,
    video: video.general
  },
  'career-basics': {
    domain: 'business',
    related: ['eda-basics', 'quality-basics', 'supply-chain-basics'],
    article: article.career,
    video: video.general
  },
  'eda-basics': {
    domain: 'system',
    related: ['logic-basics', 'roadmap-basics', 'device-structures'],
    article: article.eda,
    video: video.general
  }
};

function yamlString(value) {
  return JSON.stringify(value);
}

function yamlArray(arr, indent = 0) {
  if (!arr || arr.length === 0) return '';
  const pad = ' '.repeat(indent);
  return arr.map((item) => `${pad}- ${yamlString(item)}`).join('\n');
}

function yamlResources(resources, indent = 0) {
  if (!resources || resources.length === 0) return '';
  const pad = ' '.repeat(indent);
  return resources
    .map((res) => {
      return [
        `${pad}- type: ${yamlString(res.type)}`,
        `${pad}  title: ${yamlString(res.title)}`,
        `${pad}  url: ${yamlString(res.url)}`,
        `${pad}  source: ${yamlString(res.source)}`
      ].join('\n');
    })
    .join('\n');
}

function buildFrontmatter(data) {
  const lines = [];
  lines.push(`title: ${yamlString(data.title ?? '')}`);
  lines.push(`slug: ${yamlString(data.slug ?? '')}`);
  lines.push('audiences:');
  lines.push(yamlArray(data.audiences ?? [], 2) || '  - "student"');
  lines.push('tags:');
  lines.push(yamlArray(data.tags ?? [], 2));
  lines.push(`domain: ${yamlString(data.domain ?? 'process')}`);
  lines.push(`one_line: ${yamlString(data.one_line ?? '')}`);
  lines.push('prereq_concepts:');
  lines.push(yamlArray(data.prereq_concepts ?? [], 2));
  lines.push('next_concepts:');
  lines.push(yamlArray(data.next_concepts ?? [], 2));
  lines.push('related_concepts:');
  lines.push(yamlArray(data.related_concepts ?? [], 2));
  lines.push(`updated_at: ${yamlString(data.updated_at ?? '')}`);
  lines.push('sources:');
  lines.push(yamlArray(data.sources ?? [], 2));
  lines.push('resources:');
  lines.push(yamlResources(data.resources ?? [], 2));
  return lines.filter(Boolean).join('\n');
}

const files = fs.readdirSync(base).filter((f) => f.endsWith('.mdx'));
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const filePath = path.join(base, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};
  const config = mapping[slug];
  if (!config) continue;

  const resources = [
    { type: 'article', ...config.article },
    { type: 'video', ...config.video }
  ];

  const updated = {
    ...data,
    domain: config.domain,
    related_concepts: config.related,
    sources: [config.article.url, config.video.url],
    resources
  };

  const front = buildFrontmatter(updated);
  const body = parsed.content.trim();
  const next = `---\n${front}\n---\n${body}\n`;
  fs.writeFileSync(filePath, next, 'utf8');
}

console.log('updated concepts:', files.length);
