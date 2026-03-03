import Link from 'next/link';
import type { Article } from '@/lib/schema';

export default function ArticleCard({
  article,
  density = 'comfortable'
}: {
  article: Article;
  density?: 'comfortable' | 'compact';
}) {
  const compact = density === 'compact';
  return (
    <Link href={`/articles/${article.slug}`} className={`card hover:border-accent-500 ${compact ? 'p-3' : ''}`}>
      <h3 className="section-title">{article.title}</h3>
      <p className={compact ? 'mt-1 text-xs text-ink-600' : 'mt-2 text-sm text-ink-600'}>
        {article.summary_3lines?.[0] ?? '핵심 요약을 준비 중입니다.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
        {article.tags.slice(0, compact ? 2 : 4).map((tag) => (
          <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
