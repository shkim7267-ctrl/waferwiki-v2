type SourceNoticeProps = {
  sources?: string[];
  minSources?: number;
  recommendedSources?: number;
  label?: string;
  note?: string;
  compact?: boolean;
};

function buildStatusLabel(count: number, minSources?: number, recommendedSources?: number) {
  if (typeof minSources === 'number' && count < minSources) return '필수 부족';
  if (typeof recommendedSources === 'number' && count < recommendedSources) return '권장 미달';
  if (count === 0) return '미표기';
  return '확인됨';
}

export default function SourceNotice({
  sources = [],
  minSources,
  recommendedSources,
  label = '출처',
  note,
  compact = false
}: SourceNoticeProps) {
  const count = sources.length;
  const isMissingRequired = typeof minSources === 'number' && count < minSources;
  const statusLabel = buildStatusLabel(count, minSources, recommendedSources);
  const wrapperClass = compact
    ? 'rounded-lg border border-ink-200/60 bg-ink-50/40 px-3 py-2'
    : 'card space-y-2';
  const titleClass = compact ? 'text-xs font-semibold uppercase tracking-[0.2em] text-ink-500' : 'section-title';

  const description = isMissingRequired
    ? `${label} ${count}개 · 최소 ${minSources}개 필요`
    : typeof recommendedSources === 'number'
    ? `${label} ${count}개 · 권장 ${recommendedSources}개`
    : `${label} ${count}개`;

  return (
    <section className={wrapperClass}>
      <div className={compact ? 'flex flex-wrap items-start justify-between gap-2' : 'flex flex-wrap items-start justify-between gap-2'}>
        <div>
          <h3 className={titleClass}>콘텐츠 품질</h3>
          <p className="text-sm text-ink-600">{description}</p>
          {note ? <p className="mt-1 text-xs text-ink-500">{note}</p> : null}
        </div>
        <span
          className={
            isMissingRequired
              ? 'rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700'
              : 'rounded-full bg-ink-100 px-2 py-1 text-xs font-medium text-ink-600'
          }
        >
          {statusLabel}
        </span>
      </div>

      {sources.length === 0 ? (
        <p className="text-xs text-ink-500">출처 링크가 아직 없습니다.</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-xs text-ink-600">
          {sources.map((source) => (
            <li key={source}>
              <a href={source} className="text-accent-600" target="_blank" rel="noreferrer">
                {source}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
