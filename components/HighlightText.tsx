import type { ReactNode } from 'react';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function HighlightText({ text, query }: { text: string; query: string }): ReactNode {
  const tokens = query
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return text;

  const pattern = tokens.map(escapeRegExp).join('|');
  const regex = new RegExp(`(${pattern})`, 'ig');
  const lowerTokens = tokens.map((token) => token.toLowerCase());

  return text.split(regex).map((part, index) => {
    if (lowerTokens.includes(part.toLowerCase())) {
      return (
        <mark key={`${part}-${index}`} className="rounded bg-amber-100 px-1 text-ink-900">
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}
