import Link from 'next/link';

export default function NextCTA({
  title = '다음으로 보기',
  description,
  href,
  label = '바로가기'
}: {
  title?: string;
  description: string;
  href: string;
  label?: string;
}) {
  return (
    <section className="card flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="section-title">{title}</h3>
        <p className="text-sm text-ink-600">{description}</p>
      </div>
      <Link href={href} className="rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white">
        {label}
      </Link>
    </section>
  );
}
