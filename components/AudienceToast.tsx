'use client';

import { useAudience } from '@/components/AudienceProvider';

export default function AudienceToast() {
  const { toast } = useAudience();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-xl bg-ink-900 px-4 py-3 text-xs font-medium text-white shadow-lg">
        {toast.message}
      </div>
    </div>
  );
}
