import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticleBySlug, getArticles } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import SummaryCard from '@/components/SummaryCard';
import RecentViewTracker from '@/components/RecentViewTracker';

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  return (
    <div className="space-y-8">
      <RecentViewTracker
        item={{
          id: `article:${article.slug}`,
          title: article.title,
          href: `/articles/${article.slug}`,
          type: 'Article',
          section: 'articles'
        }}
      />
      <SummaryCard
        label="Article"
        title={article.title}
        summaryLines={article.summary_3lines ?? []}
        tags={article.tags}
        updatedAt={article.updated_at}
      />

      <article className="prose max-w-none text-ink-700">
        <MDXRemote source={article.body} />
      </article>

      <NextCTA description="관련 용어를 바로 확인해보세요." href="/glossary" label="Dictionary 보기" />
    </div>
  );
}
