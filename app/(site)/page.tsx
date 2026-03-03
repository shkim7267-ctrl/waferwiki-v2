import Link from 'next/link';

const quickLinks = [
  {
    title: '공정 큰그림 지도',
    desc: 'Wafer부터 Packaging까지 공정 흐름을 한 눈에.',
    href: '/map'
  },
  {
    title: 'Semiconductor Dictionary',
    desc: '핵심 용어 정의와 등장 맥락을 빠르게 확인.',
    href: '/glossary'
  },
  {
    title: '입문용 글',
    desc: '개념을 조금 더 길게 이해하고 싶은 사람을 위한 글.',
    href: '/articles'
  },
  {
    title: 'Invest 허브',
    desc: '기술 키워드를 공급망/세그먼트 관점으로 이해.',
    href: '/invest'
  },
  {
    title: 'Career 허브',
    desc: '직무맵/면접/프로젝트로 취업 준비 정리.',
    href: '/career'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Semiconductor Learning Hub</p>
        <h1 className="text-3xl font-semibold text-ink-900 md:text-4xl">
          반도체 입문/학습/커리어 허브
        </h1>
        <p className="max-w-2xl text-base text-ink-600">
          반도체 공정, 용어, 학습, 커리어 흐름을 한 곳에서 탐색할 수 있도록 정리했습니다.
          기초부터 실무 맥락까지 연결해서 볼 수 있는 통합 허브입니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/map"
            className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white"
          >
            공정 지도 보기
          </Link>
          <Link
            href="/glossary"
            className="rounded-full border border-ink-200/60 px-4 py-2 text-sm font-medium text-ink-700"
          >
            Dictionary 보기
          </Link>
          <a
            href="https://semibridge.pages.dev"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-accent-500 px-4 py-2 text-sm font-medium text-accent-600"
          >
            Semibridge 보기
          </a>
        </div>
      </section>

      <section className="card border-accent-100 bg-accent-100/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Partner Site</p>
            <h2 className="text-xl font-semibold text-ink-900">Semibridge 기업 소개 페이지</h2>
            <p className="mt-2 text-sm text-ink-600">
              반도체 기업 웹사이트 포트폴리오를 확인하고 싶다면 Semibridge로 이동하세요.
            </p>
          </div>
          <a
            href="https://semibridge.pages.dev"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white"
          >
            Semibridge 바로가기
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="card hover:border-accent-500">
            <h2 className="section-title">{item.title}</h2>
            <p className="mt-2 text-sm text-ink-600">{item.desc}</p>
            <p className="mt-4 text-xs font-semibold text-accent-600">바로가기 →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
