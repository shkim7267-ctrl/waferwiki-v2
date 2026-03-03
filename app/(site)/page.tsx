import Link from 'next/link';

const quickLinks = [
  {
    title: '10분 스타터',
    desc: '반도체 흐름을 10분 안에 파악하는 카드형 시작점.',
    href: '/start'
  },
  {
    title: '공정 큰그림 지도',
    desc: 'Wafer부터 Packaging까지 공정 흐름을 한 눈에.',
    href: '/map'
  },
  {
    title: '쉬운 용어사전',
    desc: '용어를 빠르게 찾아보고, 맥락까지 확인.',
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
          Phase 0는 일반인(비전공) 기준으로 10분 안에 큰그림을 이해할 수 있도록 설계했습니다.
          Phase 1(Invest), Phase 2(Learn), Phase 3(Career)까지 기본 기능이 구현되었습니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white"
          >
            10분 스타터 시작
          </Link>
          <Link
            href="/map"
            className="rounded-full border border-ink-200/60 px-4 py-2 text-sm font-medium text-ink-700"
          >
            공정 지도 보기
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

      <section className="card space-y-2">
        <h2 className="section-title">Phase 진행 상황</h2>
        <p className="text-sm text-ink-600">
          Phase 0(일반인), Phase 1(Invest), Phase 2(Learn), Phase 3(Career) 기본 기능 구현 완료.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-ink-600">
          <span className="rounded-full border border-ink-200/60 px-3 py-1">/invest</span>
          <span className="rounded-full border border-ink-200/60 px-3 py-1">/learn</span>
          <span className="rounded-full border border-ink-200/60 px-3 py-1">/career</span>
        </div>
      </section>
    </div>
  );
}
