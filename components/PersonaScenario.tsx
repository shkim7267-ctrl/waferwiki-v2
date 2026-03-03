import Link from 'next/link';

type ScenarioLink = {
  label: string;
  href: string;
};

type ScenarioStep = {
  title: string;
  description: string;
  time?: string;
  links: ScenarioLink[];
};

type PersonaScenarioProps = {
  heading?: string;
  subheading?: string;
  steps: ScenarioStep[];
};

export default function PersonaScenario({
  heading = '추천 흐름',
  subheading = '이 페이지에서 이렇게 보세요',
  steps
}: PersonaScenarioProps) {
  return (
    <section className="card space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{heading}</p>
        <h2 className="text-lg font-semibold text-ink-900">{subheading}</h2>
        <p className="text-sm text-ink-600">클릭 즉시 다음에 봐야 할 흐름을 안내합니다.</p>
      </div>
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-ink-200/60 bg-white/80 p-4">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span className="font-semibold uppercase tracking-[0.2em]">Step {index + 1}</span>
              {step.time ? <span>{step.time}</span> : null}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-600">{step.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {step.links.map((link, linkIndex) => (
                <Link
                  key={`${step.title}-${link.href}`}
                  href={link.href}
                  className={
                    linkIndex === 0
                      ? 'rounded-full bg-accent-600 px-3 py-1 text-xs font-medium text-white'
                      : 'rounded-full border border-ink-200/60 px-3 py-1 text-xs text-ink-600'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
