'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Audience } from '@/lib/schema';

const STORAGE_KEY = 'waferwiki.audience';
const labels: Record<Audience, string> = {
  general: '일반인',
  investor: '투자자',
  student: '대학생',
  jobseeker: '취준생'
};

const AudienceContext = createContext<{
  audience: Audience;
  setAudience: (audience: Audience) => void;
  selectAudience: (audience: Audience) => void;
  toast: { message: string; visible: boolean; key: number };
} | null>(null);

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudience] = useState<Audience>('general');
  const [toast, setToast] = useState<{ message: string; visible: boolean; key: number }>({
    message: '',
    visible: false,
    key: 0
  });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Audience | null;
    if (stored) {
      setAudience(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, audience);
  }, [audience]);

  const selectAudience = (nextAudience: Audience) => {
    setAudience(nextAudience);
    const message = `필터 변경: ${labels[nextAudience]} 기준`;
    setToast({ message, visible: true, key: Date.now() });
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2400);
  };

  return (
    <AudienceContext.Provider value={{ audience, setAudience, selectAudience, toast }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const ctx = useContext(AudienceContext);
  if (!ctx) {
    return {
      audience: 'general' as Audience,
      setAudience: () => {},
      selectAudience: () => {},
      toast: { message: '', visible: false, key: 0 }
    };
  }
  return ctx;
}
