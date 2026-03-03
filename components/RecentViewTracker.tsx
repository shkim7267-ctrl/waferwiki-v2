'use client';

import { useEffect } from 'react';

export type RecentItem = {
  id: string;
  title: string;
  href: string;
  type: string;
  section: string;
  viewed_at: string;
};

const STORAGE_KEY = 'waferwiki.recent';
const MAX_ITEMS = 80;

function loadItems(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveItems(items: RecentItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function RecentViewTracker({ item }: { item: Omit<RecentItem, 'viewed_at'> }) {
  useEffect(() => {
    const items = loadItems().filter((entry) => entry.id !== item.id);
    items.unshift({ ...item, viewed_at: new Date().toISOString() });
    const trimmed = items.slice(0, MAX_ITEMS);
    saveItems(trimmed);
  }, [item]);

  return null;
}
