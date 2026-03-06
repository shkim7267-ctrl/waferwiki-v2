'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabaseClient';
import type { SearchDoc } from '@/lib/search';
import type { ChatSession, Profile } from '@/lib/schema';
import type { Session } from '@supabase/supabase-js';

type RecommendResponse = {
  tags: string[];
};

export default function MeDashboard({ docs }: { docs: SearchDoc[] }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [recommendTags, setRecommendTags] = useState<string[]>([]);

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
    return () => {
      ignore = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.id) return;
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, nickname, tags, created_at, updated_at')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
        setTagInput((profileData.tags ?? []).join(', '));
      }

      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .select('id, user_id, title, summary, tags, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      if (sessionData) setSessions(sessionData as ChatSession[]);

      const { data: recData } = await supabase.functions.invoke('recommend');
      if (recData) setRecommendTags((recData as RecommendResponse).tags ?? []);
    };

    loadData();
  }, [session]);

  const recommendations = useMemo(() => {
    if (docs.length === 0) return [];
    const normalized = recommendTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    if (normalized.length === 0) return docs.slice(0, 6);

    const scored = docs
      .map((doc) => {
        const docTags = doc.tags.map((tag) => tag.toLowerCase());
        const matches = normalized.filter((tag) => docTags.includes(tag)).length;
        return { doc, score: matches };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.doc);

    return scored.length > 0 ? scored : docs.slice(0, 6);
  }, [docs, recommendTags]);

  const handleSaveProfile = async () => {
    if (!session?.user?.id) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus('error');
      setMessage('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }
    setStatus('saving');
    setMessage('');
    const tags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, nickname: profile?.nickname ?? null, tags }, { onConflict: 'id' });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    setStatus('idle');
    setMessage('저장했습니다.');
  };

  if (!session) {
    return (
      <div className="card space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">내 기록</h1>
        <p className="text-sm text-ink-600">로그인 후 개인 기록과 추천을 확인할 수 있습니다.</p>
        <Link href="/login" className="rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white">
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">My Profile</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink-900">관심 태그 설정</h1>
          <p className="mt-2 text-sm text-ink-600">관심 키워드를 입력하면 맞춤 추천에 반영됩니다.</p>
        </div>
        <input
          className="w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          placeholder="예: euv, lithography, packaging"
        />
        <button
          type="button"
          onClick={handleSaveProfile}
          className="rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {status === 'saving' ? '저장 중...' : '저장하기'}
        </button>
        {message ? <p className="text-sm text-ink-600">{message}</p> : null}
      </section>

      <section className="space-y-3">
        <h2 className="section-title">최근 질문 요약</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-ink-600">저장된 질문이 없습니다. /chat에서 먼저 질문해보세요.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {sessions.map((item) => (
              <div key={item.id} className="card space-y-2">
                <h3 className="text-base font-semibold text-ink-900">{item.title}</h3>
                <p className="text-sm text-ink-600">{item.summary}</p>
                <div className="flex flex-wrap gap-2 text-xs text-ink-500">
                  {item.tags?.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink-200/60 px-2 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="section-title">맞춤 추천</h2>
        {recommendations.length === 0 ? (
          <p className="text-sm text-ink-600">추천을 만들기 위해 질문 또는 태그를 추가해보세요.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((item) => (
              <Link key={item.id} href={item.href} className="card hover:border-accent-500">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">{item.type}</div>
                <div className="mt-2 text-base font-semibold text-ink-900">{item.title}</div>
                <p className="mt-2 text-sm text-ink-600">{item.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
