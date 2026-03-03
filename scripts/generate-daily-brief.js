const fs = require('fs');
const path = require('path');

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const UPSTAGE_MODEL = process.env.UPSTAGE_MODEL || 'solar-pro';
const TIMEZONE = process.env.BRIEF_TIMEZONE || 'Asia/Seoul';
const OVERWRITE = process.env.BRIEF_OVERWRITE === 'true';
const SOURCE_MODE = process.env.BRIEF_SOURCE_MODE || 'broad';
const MIN_GOOD = Number(process.env.BRIEF_MIN_GOOD ?? 8);
const MIN_CHARS = Number(process.env.BRIEF_MIN_CHARS ?? 1200);
const MIN_BULLET_CHARS = Number(process.env.BRIEF_MIN_BULLET_CHARS ?? 30);
const MIN_KEY_TAKEAWAY_CHARS = Number(process.env.BRIEF_MIN_KEY_TAKEAWAY_CHARS ?? 60);
const MIN_IMPACT_CHARS = Number(process.env.BRIEF_MIN_IMPACT_CHARS ?? 40);
const MAX_ATTEMPTS = Number(process.env.BRIEF_MAX_ATTEMPTS ?? 30);

if (!UPSTAGE_API_KEY) {
  console.error('Missing UPSTAGE_API_KEY');
  process.exit(1);
}

const CURATED_DOMAINS = [
  { domain: 'semiengineering.com', lang: 'en' },
  { domain: 'eetimes.com', lang: 'en' },
  { domain: 'semiconductordigest.com', lang: 'en' },
  { domain: 'semi.org', lang: 'en' },
  { domain: 'sia.org', lang: 'en' },
  { domain: 'reuters.com', lang: 'en' },
  { domain: 'digitimes.com', lang: 'en' },
  { domain: 'etnews.com', lang: 'ko' },
  { domain: 'zdnet.co.kr', lang: 'ko' },
  { domain: 'hankyung.com', lang: 'ko' },
  { domain: 'fnnews.com', lang: 'ko' },
  { domain: 'news.skhynix.co.kr', lang: 'ko' },
  { domain: 'samsungsemiconductor.com', lang: 'en' }
];

const CURATED_KEYWORDS_EN =
  'semiconductor OR chip OR foundry OR memory OR HBM OR EUV OR packaging OR equipment';
const CURATED_KEYWORDS_KO =
  '반도체 OR 메모리 OR 파운드리 OR 장비 OR 패키징 OR 공정 OR 수율';

function buildGoogleNewsRss(query, lang) {
  const isKo = lang === 'ko';
  const params = new URLSearchParams({
    q: query,
    hl: isKo ? 'ko' : 'en-US',
    gl: isKo ? 'KR' : 'US',
    ceid: isKo ? 'KR:ko' : 'US:en'
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
}

function buildRssUrls() {
  if (process.env.BRIEF_RSS_URLS) {
    return process.env.BRIEF_RSS_URLS.split(',')
      .map((u) => u.trim())
      .filter(Boolean);
  }

  if (SOURCE_MODE === 'curated') {
    return CURATED_DOMAINS.map((entry) => {
      const keywords = entry.lang === 'ko' ? CURATED_KEYWORDS_KO : CURATED_KEYWORDS_EN;
      const query = `site:${entry.domain} (${keywords})`;
      return buildGoogleNewsRss(query, entry.lang);
    });
  }

  return [
    'https://news.google.com/rss/search?q=semiconductor&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=semiconductor%20industry&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=HBM&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=TSMC&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=Samsung%20foundry&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=SK%20hynix%20HBM&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=ASML%20EUV&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=chip%20equipment%20Applied%20Materials%20Lam%20Research%20KLA&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=export%20control%20chips&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=%EB%B0%98%EB%8F%84%EC%B2%B4&hl=ko&gl=KR&ceid=KR:ko'
  ];
}

const RSS_URLS = buildRssUrls();

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function formatDateISO(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

function yamlEscape(value) {
  if (value === null || value === undefined) return '';
  const raw = String(value);
  return raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function decodeHtml(str) {
  return str
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractArticleText(html) {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const base = articleMatch ? articleMatch[1] : html;
  const text = stripTags(base);
  return decodeHtml(text).slice(0, 12000);
}

function isGoogleNewsUrl(url) {
  return url.includes('news.google.com');
}

function extractCanonicalUrl(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (match?.[1]) return match[1];
  return '';
}

function extractExternalUrl(html) {
  const links = [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map((m) => m[1]);
  for (const link of links) {
    if (link.includes('news.google.com')) continue;
    if (link.includes('google.com')) continue;
    return link;
  }
  return '';
}

function normalizeTag(value) {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u3131-\uD79D]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function inferTopic(title) {
  const lower = String(title || '').toLowerCase();
  const map = [
    { key: 'hbm', tag: 'hbm' },
    { key: 'euv', tag: 'euv' },
    { key: 'high-na', tag: 'high-na' },
    { key: 'packaging', tag: 'advanced-packaging' },
    { key: 'chiplet', tag: 'chiplet' },
    { key: 'foundry', tag: 'foundry' },
    { key: 'tsmc', tag: 'foundry' },
    { key: 'samsung', tag: 'foundry' },
    { key: 'sk hynix', tag: 'memory' },
    { key: 'memory', tag: 'memory' },
    { key: 'dram', tag: 'memory' },
    { key: 'nand', tag: 'memory' },
    { key: 'asml', tag: 'equipment' },
    { key: 'applied materials', tag: 'equipment' },
    { key: 'lam research', tag: 'equipment' },
    { key: 'kla', tag: 'equipment' },
    { key: 'export control', tag: 'policy' },
    { key: 'capex', tag: 'capex' },
    { key: 'yield', tag: 'yield' }
  ];

  for (const entry of map) {
    if (lower.includes(entry.key)) return entry.tag;
  }
  return 'semiconductor';
}

function isGoodSummary(summary) {
  if (!summary) return false;
  if (summary.error) return false;
  if (summary.url && isGoogleNewsUrl(summary.url)) return false;
  const articleLen = Number(summary._article_len ?? 0);
  if (articleLen < MIN_CHARS) return false;
  const bullets = Array.isArray(summary.summary_bullets)
    ? summary.summary_bullets.filter((b) => typeof b === 'string' && b.trim().length > 0)
    : [];
  if (bullets.length < 3) return false;
  if (bullets.slice(0, 3).some((b) => b.trim().length < MIN_BULLET_CHARS)) return false;
  const keyTakeawayLen = (summary.key_takeaway || '').trim().length;
  const impactLen = (summary.market_impact || '').trim().length;
  if (keyTakeawayLen < MIN_KEY_TAKEAWAY_CHARS) return false;
  if (impactLen < MIN_IMPACT_CHARS) return false;
  return true;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7'
    }
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return res.text();
}

function parseRssItems(xml) {
  const items = xml.split(/<item>/i).slice(1);
  const parsed = [];

  for (const chunk of items) {
    const itemXml = chunk.split(/<\/item>/i)[0];
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
    const pubMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    const title = titleMatch ? decodeHtml(titleMatch[1].trim()) : '';
    const link = linkMatch ? decodeHtml(linkMatch[1].trim()) : '';
    const pubDate = pubMatch ? decodeHtml(pubMatch[1].trim()) : '';
    const source = sourceMatch ? decodeHtml(sourceMatch[1].trim()) : '';

    if (!title || !link) continue;
    parsed.push({ title, link, pubDate, source });
  }

  return parsed;
}

async function fetchCandidates() {
  const seen = new Set();
  const items = [];

  for (const url of RSS_URLS) {
    try {
      const xml = await fetchText(url);
      const parsed = parseRssItems(xml);
      for (const item of parsed) {
        if (seen.has(item.link)) continue;
        seen.add(item.link);
        items.push(item);
      }
    } catch (error) {
      console.warn(`RSS fetch failed: ${url} (${error.message})`);
    }
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return items.slice(0, 80).map((item) => ({
    headline: item.title,
    source: item.source || 'Google News',
    published_at: item.pubDate || '',
    topic: inferTopic(item.title),
    url: item.link
  }));
}

async function callSolar(messages) {
  const res = await fetch('https://api.upstage.ai/v1/solar/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTAGE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: UPSTAGE_MODEL,
      messages,
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Solar API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  return content;
}

async function resolveAndFetch(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,ko-KR,ko;q=0.8'
    }
  });
  const html = await res.text();
  const finalUrl = res.url || url;
  if (isGoogleNewsUrl(finalUrl)) {
    const canonical = extractCanonicalUrl(html);
    const external = canonical && !isGoogleNewsUrl(canonical) ? canonical : extractExternalUrl(html);
    if (external) {
      const externalRes = await fetch(external, {
        redirect: 'follow',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ko-KR,ko;q=0.8'
        }
      });
      const externalHtml = await externalRes.text();
      return { finalUrl: externalRes.url || external, html: externalHtml };
    }
  }
  return { finalUrl, html };
}

async function summarizeArticle(item, articleText) {
  const system =
    '당신은 반도체 섹터 전문 애널리스트입니다. 반드시 유효한 JSON만 출력하고 추가 텍스트는 금지입니다.';
  const user = `아래 기사 내용을 한국어로 요약해 JSON으로만 출력하세요.

[메타]
- headline: ${item.headline}
- source: ${item.source}
- published_at: ${item.published_at}
- topic: ${item.topic}
- url: ${item.url}

[기사 본문]
${articleText}

[출력 스키마(키 고정)]
{
  "headline":"",
  "source":"",
  "published_at":"",
  "topic":"",
  "url":"",
  "summary_bullets":["","",""],
  "key_takeaway":"",
  "market_impact":"과장 없이 1문장",
  "watchlist_companies":[""],
  "risks":[""],
  "confidence":"high|medium|low",
  "error":""
}

제약:
- 기사에 없는 숫자/사실은 만들지 말 것
- 투자 수익 보장 표현 금지
- summary_bullets는 각 30자 이상, 총 3개
- key_takeaway는 60자 이상 1문장
- market_impact는 40자 이상 1문장
- 출력은 JSON 객체 1개만`;

  try {
    const content = await callSolar([
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]);
    return JSON.parse(content);
  } catch (error) {
    return {
      headline: item.headline,
      source: item.source,
      published_at: item.published_at,
      topic: item.topic,
      url: item.url,
      summary_bullets: [item.headline],
      key_takeaway: '',
      market_impact: '',
      watchlist_companies: [],
      risks: [],
      confidence: 'low',
      error: 'LLM_JSON_PARSE_FAIL'
    };
  }
}

async function run() {
  const now = new Date();
  const dateStr = formatDateISO(now, TIMEZONE);
  const slug = `daily-${dateStr}`;
  const title = `${dateStr} 일간 브리핑`;
  const outPath = path.join(process.cwd(), 'content', 'invest', 'briefs', `${slug}.mdx`);

  if (fs.existsSync(outPath) && !OVERWRITE) {
    console.log(`Daily brief already exists: ${outPath}`);
    return;
  }

  const candidates = await fetchCandidates();
  if (candidates.length === 0) {
    throw new Error('No RSS candidates found');
  }
  const summaries = [];
  const goodSummaries = [];
  const weakSummaries = [];
  let attempts = 0;

  for (const item of candidates) {
    if (goodSummaries.length >= 10) break;
    if (attempts >= MAX_ATTEMPTS) break;
    attempts += 1;
    try {
      const { finalUrl, html } = await resolveAndFetch(item.url);
      const articleText = extractArticleText(html);
      const summary = await summarizeArticle({ ...item, url: finalUrl }, articleText);
      summary._article_len = articleText.length;
      summaries.push(summary);
      if (isGoodSummary(summary)) {
        goodSummaries.push(summary);
      } else {
        weakSummaries.push(summary);
      }
      await sleep(400);
    } catch (error) {
      console.warn(`Article fetch failed: ${item.url} (${error.message})`);
      const fallback = {
        headline: item.headline,
        source: item.source,
        published_at: item.published_at,
        topic: item.topic,
        url: item.url,
        summary_bullets: [item.headline],
        key_takeaway: '',
        market_impact: '',
        watchlist_companies: [],
        risks: [],
        confidence: 'low',
        error: 'ARTICLE_FETCH_FAIL',
        _article_len: 0
      };
      summaries.push(fallback);
      weakSummaries.push(fallback);
    }
  }

  const orderedSummaries = [...goodSummaries, ...weakSummaries].slice(0, 10);
  if (orderedSummaries.length < 10) {
    throw new Error(`Not enough summaries (${orderedSummaries.length}/10)`);
  }

  const goodCount = orderedSummaries.filter((s) => isGoodSummary(s)).length;
  if (goodCount < MIN_GOOD) {
    throw new Error(`Quality gate failed: ${goodCount}/10 good summaries.`);
  }

  const sources = Array.from(new Set(orderedSummaries.map((s) => s.url))).slice(0, 12);
  if (sources.length < 2) {
    throw new Error(`Not enough sources (${sources.length})`);
  }

  const summaryLines = orderedSummaries
    .filter((s) => isGoodSummary(s))
    .slice(0, 3)
    .map((s) => s.key_takeaway || s.summary_bullets?.[0] || s.headline)
    .filter(Boolean);

  if (summaryLines.length < 3) {
    throw new Error(`Not enough summary lines (${summaryLines.length}/3)`);
  }

  const tags = Array.from(
    new Set(['daily', ...orderedSummaries.map((s) => normalizeTag(s.topic)).filter(Boolean)])
  ).slice(0, 10);

  if (tags.length === 1) {
    tags.push('semiconductor');
  }

  const frontmatter = [
    '---',
    `title: "${yamlEscape(title)}"`,
    `slug: "${slug}"`,
    'audiences:',
    '  - investor',
    'period: daily',
    'summary_3lines:',
    ...summaryLines.map((line) => `  - "${yamlEscape(line)}"`),
    'tags:',
    ...tags.map((tag) => `  - "${yamlEscape(tag)}"`),
    `updated_at: "${new Date().toISOString()}"`,
    'sources:',
    ...sources.map((src) => `  - "${yamlEscape(src)}"`),
    '---'
  ].join('\n');

  const bodyLines = [];
  bodyLines.push('## 오늘의 요약');
  summaryLines.forEach((line) => bodyLines.push(`- ${line}`));
  bodyLines.push('');
  bodyLines.push('## 주요 기사');
  orderedSummaries.forEach((s) => {
    bodyLines.push(`### ${s.headline}`);
    if (s.source) bodyLines.push(`- 출처: ${s.source}`);
    if (s.published_at) bodyLines.push(`- 게시: ${s.published_at}`);
    if (Array.isArray(s.summary_bullets)) {
      s.summary_bullets
        .filter(Boolean)
        .slice(0, 3)
        .forEach((b) => bodyLines.push(`- ${b}`));
    }
    if (s.key_takeaway) bodyLines.push(`- 핵심: ${s.key_takeaway}`);
    if (s.market_impact) bodyLines.push(`- 영향: ${s.market_impact}`);
    if (Array.isArray(s.risks) && s.risks.length) {
      bodyLines.push(`- 리스크: ${s.risks.filter(Boolean).join(', ')}`);
    }
    bodyLines.push(`- 원문: ${s.url}`);
    bodyLines.push('');
  });
  bodyLines.push('## 영향 경로 요약');
  bodyLines.push('- 공급망: 부품/소재/장비 리드타임 변화가 병목으로 연결될 수 있습니다.');
  bodyLines.push('- 수율: 공정 안정화 여부가 생산성/수율 개선 속도에 영향을 줍니다.');
  bodyLines.push('- CapEx: 증설/전환 투자 시점이 라인 가동 시점과 직결됩니다.');
  bodyLines.push('');
  bodyLines.push('## 출처');
  sources.forEach((src) => bodyLines.push(`- ${src}`));
  bodyLines.push('');
  bodyLines.push('> 본 브리핑은 정보 요약이며 투자 조언이나 수익 보장을 제공하지 않습니다.');

  const mdx = `${frontmatter}\n\n${bodyLines.join('\n')}\n`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, mdx, 'utf8');
  console.log(`Daily brief generated: ${outPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
