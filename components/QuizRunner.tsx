'use client';

import { useMemo, useState } from 'react';
import type { LearnQuizQuestion } from '@/lib/schema';

export default function QuizRunner({ questions }: { questions: LearnQuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const isCorrect = useMemo(() => {
    if (selected === null) return null;
    return selected === current.answer_index;
  }, [selected, current.answer_index]);

  const handleNext = () => {
    if (selected === current.answer_index) {
      setCorrectCount((prev) => prev + 1);
    }
    setSelected(null);
    setIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  if (!current) {
    return <p className="text-sm text-ink-600">퀴즈 문항이 없습니다.</p>;
  }

  if (index === questions.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500">
          Question {index + 1} / {questions.length}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink-900">{current.q}</h3>
        <div className="mt-3 space-y-2">
          {current.choices.map((choice, idx) => (
            <button
              key={choice}
              type="button"
              onClick={() => setSelected(idx)}
              className={
                selected === idx
                  ? 'w-full rounded-lg border border-accent-500 bg-accent-100 px-3 py-2 text-left text-sm'
                  : 'w-full rounded-lg border border-ink-200/60 px-3 py-2 text-left text-sm'
              }
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {selected !== null ? (
        <div className="card space-y-2">
          <p className={isCorrect ? 'text-sm font-semibold text-green-600' : 'text-sm font-semibold text-red-600'}>
            {isCorrect ? '정답입니다.' : '오답입니다.'}
          </p>
          <p className="text-sm text-ink-600">{current.explanation_one_line}</p>
          {!isLast ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white"
            >
              다음 문제
            </button>
          ) : (
            <div className="text-sm text-ink-600">
              퀴즈 완료. 정답 {correctCount + (isCorrect ? 1 : 0)} / {questions.length}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
