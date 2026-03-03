import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import { getSearchDocs } from '@/lib/search-data';

export const metadata = {
  title: 'WaferWiki v2 — Semiconductor Learning Hub',
  description: 'Semiconductor intro/learning/career hub focused on clear, fast understanding.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const docs = getSearchDocs();
  return (
    <html lang="ko">
      <body>
        <SiteHeader docs={docs} />
        <main className="container py-10">{children}</main>
        <footer className="border-t border-ink-200/60 py-6">
          <div className="container space-y-2 text-xs text-ink-600">
            <p className="text-ink-500">
              본 사이트는 투자 조언, 종목 추천, 가격 전망을 제공하지 않습니다. 정보는 학습용 요약입니다.
            </p>
            <p className="text-ink-500">기업 내부정보/전형 유출/허위 사실 단정 정보는 제공하지 않습니다.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
