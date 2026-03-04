import Link from 'next/link';

const flows = [
  {
    persona: '일반인',
    time: '10분',
    steps: [
      { label: '공정 큰그림', desc: 'Map에서 전체 흐름을 1분 안에 훑습니다.', href: '/map' },
      { label: '핵심 용어 5개', desc: 'Dictionary에서 모르는 단어를 바로 확인합니다.', href: '/glossary' },
      { label: '입문 글 1개', desc: 'Articles에서 큰 그림을 한 번 더 정리합니다.', href: '/articles' }
    ]
  },
  {
    persona: '투자자',
    time: '20분',
    steps: [
      { label: '핫 테마 확인', desc: 'Invest에서 HBM/EUV 등 테마를 확인합니다.', href: '/invest/themes' },
      { label: '공정 연결', desc: 'Map에서 영향 공정을 연결합니다.', href: '/map' },
      { label: '용어 리프레시', desc: 'Dictionary에서 핵심 용어를 정리합니다.', href: '/glossary' }
    ]
  },
  {
    persona: '대학생',
    time: '30분',
    steps: [
      { label: '학습 경로 선택', desc: 'Learn Paths에서 오늘의 경로를 고릅니다.', href: '/learn/paths' },
      { label: '개념 카드', desc: 'Concepts로 선수/후속 개념을 연결합니다.', href: '/learn/concepts' },
      { label: '퀴즈로 점검', desc: 'Quiz로 이해도를 확인합니다.', href: '/learn/quiz' }
    ]
  },
  {
    persona: '취준생',
    time: '30분',
    steps: [
      { label: '직무맵 확인', desc: 'Career Roles에서 직무별 역할을 확인합니다.', href: '/career/roles' },
      { label: '스킬 체크', desc: '체크리스트로 준비 상태를 점검합니다.', href: '/career/checklist' },
      { label: '질문/프로젝트', desc: 'Q뱅크와 프로젝트로 실전 준비를 합니다.', href: '/career/questions' }
    ]
  }
];

export const metadata = {
  title: 'Start | WaferWiki v2'
};

export default function StartPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Start Guide</p>
        <h1 className="text-3xl font-semibold text-ink-900">페르소나별 추천 흐름</h1>
        <p className="max-w-2xl text-sm text-ink-600">
          누구든 바로 시작할 수 있도록 페르소나별 추천 흐름을 정리했습니다.
          10~30분 안에 핵심을 파악할 수 있는 동선을 제공합니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {flows.map((flow) => (
          <div key={flow.persona} className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink-900">{flow.persona}</h2>
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
                {flow.time}
              </span>
            </div>
            <ol className="space-y-3 text-sm text-ink-600">
              {flow.steps.map((step, index) => (
                <li key={step.href} className="rounded-xl border border-ink-200/60 bg-white/70 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink-900">{step.label}</p>
                      <p className="mt-1 text-xs text-ink-600">{step.desc}</p>
                    </div>
                    <Link
                      href={step.href}
                      className="rounded-full border border-accent-500 px-3 py-1 text-xs font-semibold text-accent-600"
                    >
                      바로가기
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </div>
  );
}
