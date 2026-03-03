import Link from 'next/link';
import ArticlesList from '@/components/ArticlesList';
import { getArticles } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import RecentViewList from '@/components/RecentViewList';

export const metadata = {
  title: '입문용 글 | WaferWiki v2'
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">입문용 글</h1>
        <p className="text-sm text-ink-600">반도체 흐름을 더 깊게 이해하기 위한 입문 글 모음입니다.</p>
      </section>

      <RecentViewList section="articles" />

      <ArticlesList articles={articles} />

      <NextCTA description="공정 지도로 돌아가 큰그림을 다시 확인하세요." href="/map" label="공정 지도 보기" />
    </div>
  );
}
