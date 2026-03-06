'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

type ChatResult = {
  answer: string;
  title: string;
  summary: string;
  tags: string[];
  sessionId?: string;
};

export default function ChatPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState('');
  const [contextUrl, setContextUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<ChatResult | null>(null);

  useEffect(() => {
    let ignore = false;
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      if (!ignore) setSession(data.session ?? null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    setContextUrl(window.location.origin);
    return () => {
      ignore = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const canAsk = useMemo(() => Boolean(question.trim()) && Boolean(session), [question, session]);

  const handleAsk = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }
    if (!session) {
      setMessage('로그인이 필요합니다.');
      return;
    }
    if (!question.trim()) {
      setMessage('질문을 입력해주세요.');
      return;
    }
    setStatus('loading');
    setMessage('');
    setResult(null);

    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        question,
        context: {
          pageUrl: contextUrl || window.location.origin
        }
      }
    });

    if (error) {
      setStatus('error');
      setMessage(error.message ?? '응답 처리 중 오류가 발생했습니다.');
      return;
    }

    setStatus('idle');
    setResult(data as ChatResult);
  };

  return (
    <section className="card space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">AI Assistant</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink-900">질문하고 기록하기</h1>
        <p className="mt-2 text-sm text-ink-600">
          반도체 관련 궁금증을 질문하면 요약과 태그가 자동으로 저장됩니다. 투자 조언이나
          기업 내부정보는 제공하지 않습니다.
        </p>
      </div>

      {!session ? (
        <div className="rounded-xl border border-ink-200/60 bg-white px-4 py-3 text-sm text-ink-600">
          로그인 후 이용 가능합니다.{' '}
          <Link href="/login" className="font-semibold text-accent-600">
            로그인하기
          </Link>
        </div>
      ) : null}

      <div className="space-y-3">
        <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">질문</label>
        <textarea
          className="min-h-[140px] w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
          placeholder="예: EUV와 High-NA의 차이가 무엇인지 쉽게 설명해줘."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">참고 링크(선택)</label>
        <input
          className="w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
          value={contextUrl}
          onChange={(event) => setContextUrl(event.target.value)}
          placeholder="현재 보고 있는 페이지 URL"
        />
        <button
          type="button"
          disabled={!canAsk || status === 'loading'}
          onClick={handleAsk}
          className="rounded-full bg-accent-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === 'loading' ? '응답 생성 중...' : '질문 보내기'}
        </button>
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </div>

      {result ? (
        <div className="space-y-3 rounded-xl border border-ink-200/60 bg-white px-4 py-4">
          <h2 className="text-base font-semibold text-ink-900">{result.title}</h2>
          <p className="text-sm text-ink-700">{result.answer}</p>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">저장 요약</p>
            <p className="mt-1 text-sm text-ink-600">{result.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-ink-600">
            {result.tags?.map((tag) => (
              <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>
          <Link href="/me" className="text-sm font-semibold text-accent-600">
            내 기록에서 보기 →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
