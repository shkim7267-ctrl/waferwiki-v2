import Link from 'next/link';
import { getStartCards } from '@/lib/content';
import NextCTA from '@/components/NextCTA';
import PersonaScenario from '@/components/PersonaScenario';

export const metadata = {
  title: '10분 스타터 | WaferWiki v2'
};

export default function StartPage() {
  const cards = getStartCards();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">10분 스타터</h1>
        <p className="text-sm text-ink-600">
          6~8장의 카드로 반도체 흐름을 빠르게 잡습니다. 각 카드의 CTA로 다음 학습 단계로 이동하세요.
        </p>
      </section>

      <PersonaScenario
        steps={[
          {
            title: '10분 스타터 카드 훑기',
            description: '카드 6~8장으로 전체 흐름을 먼저 잡습니다.',
            time: '10분',
            links: [
              { label: '스타터 카드', href: '/start' },
              { label: '공정 지도', href: '/map' }
            ]
          },
          {
            title: '공정 큰그림 확인',
            description: '웨이퍼부터 패키징까지 단계별 흐름을 연결합니다.',
            time: '5~10분',
            links: [
              { label: '공정 지도', href: '/map' },
              { label: '지도 단계', href: '/map' }
            ]
          },
          {
            title: '용어사전으로 보완',
            description: '헷갈리는 용어를 간단 정의로 정리합니다.',
            time: '10분',
            links: [
              { label: '용어사전', href: '/glossary' },
              { label: 'Wafer', href: '/glossary/wafer' }
            ]
          },
          {
            title: '입문 글로 확장',
            description: '큰그림 요약 글로 흐름을 다시 한번 확인합니다.',
            time: '10~15분',
            links: [
              { label: '입문 글', href: '/articles' },
              { label: '공정 큰그림', href: '/articles/wafer-to-chip-overview' }
            ]
          }
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.slug} className="card space-y-3">
            <h2 className="section-title">{card.title}</h2>
            <ul className="space-y-1 text-sm text-ink-600">
              {card.summary_3lines.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
            <Link href={card.cta_link} className="text-sm font-semibold text-accent-600">
              다음으로 →
            </Link>
          </div>
        ))}
      </section>

      <NextCTA description="공정 큰그림 지도로 이동해 전체 흐름을 확인하세요." href="/map" label="공정 지도 보기" />
    </div>
  );
}
