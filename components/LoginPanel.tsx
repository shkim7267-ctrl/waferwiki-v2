'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function LoginPanel() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('이메일을 입력해주세요.');
      return;
    }
    setStatus('sending');
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus('error');
      setMessage('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/me`
      }
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    setStatus('sent');
    setMessage('로그인 링크를 이메일로 보냈습니다. 받은편지함을 확인하세요.');
  };

  return (
    <section className="card space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">Login</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink-900">이메일로 로그인</h1>
        <p className="mt-2 text-sm text-ink-600">
          매직링크로 로그인합니다. 링크를 클릭하면 자동으로 로그인됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
          Email
        </label>
        <input
          type="email"
          className="w-full rounded-xl border border-ink-200/60 px-4 py-3 text-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-accent-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === 'sending' ? '링크 전송 중...' : '매직링크 보내기'}
        </button>
      </form>

      {message ? (
        <p className={status === 'error' ? 'text-sm text-red-600' : 'text-sm text-ink-600'}>{message}</p>
      ) : null}
    </section>
  );
}
