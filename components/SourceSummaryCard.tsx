type SourceSummaryCardProps = {
  sources?: string[];
  title?: string;
};

function extractDomain(source: string) {
  try {
    const url = new URL(source);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export default function SourceSummaryCard({ sources = [], title = '출처 요약' }: SourceSummaryCardProps) {
  const domains = Array.from(
    new Set(
      sources
        .map((source) => extractDomain(source))
        .filter((domain) => domain.length > 0)
    )
  );

  return (
    <section className="card space-y-2">
      <h3 className="section-title">{title}</h3>
      {domains.length === 0 ? (
        <p className="text-sm text-ink-600">도메인 정보를 확인할 수 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-2 text-xs text-ink-500">
          {domains.map((domain) => (
            <span key={domain} className="rounded-full border border-ink-200/60 px-2 py-1">
              {domain}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
