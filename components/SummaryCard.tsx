type SummaryCardProps = {
  label?: string;
  title: string;
  summaryLines: string[];
  tags?: string[];
  updatedAt?: string;
};

const STALE_DAYS = 90;

function formatDate(value?: string) {
  if (!value) return '';
  const iso = value.split('T')[0];
  return iso;
}

function isStale(updatedAt?: string) {
  if (!updatedAt) return false;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > STALE_DAYS;
}

export default function SummaryCard({ label, title, summaryLines, tags = [], updatedAt }: SummaryCardProps) {
  const displayLines = summaryLines.filter(Boolean).slice(0, 3);
  const stale = isStale(updatedAt);
  const updatedLabel = formatDate(updatedAt);

  return (
    <section className="card space-y-3">
      {label ? <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{label}</p> : null}
      <h1 className="text-3xl font-semibold text-ink-900">{title}</h1>
      {displayLines.length > 0 ? (
        <ul className="space-y-1 text-sm text-ink-600">
          {displayLines.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      ) : null}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-xs text-ink-500">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <span>업데이트: {updatedLabel || '-'}</span>
        {stale ? (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">업데이트 필요</span>
        ) : null}
      </div>
    </section>
  );
}
