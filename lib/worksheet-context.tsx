'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuestionWithMetadata } from './data-loader';

interface WorksheetContextType {
  items: QuestionWithMetadata[];
  addItem: (question: QuestionWithMetadata) => void;
  removeItem: (question: QuestionWithMetadata) => void;
  clearAll: () => void;
  isInWorksheet: (question: QuestionWithMetadata) => boolean;
  reorderItems: (fromIndex: number, toIndex: number) => void;
}

const WorksheetContext = createContext<WorksheetContextType | null>(null);

/**
 * What makes two entries the same question.
 *
 * Paper questions key on where they came from. Generated ones have no paper, so
 * they carry a `uid` — variation code and seed — and every one of them would
 * otherwise look like "year undefined, paper 0" and the second would be
 * silently refused as a duplicate of the first.
 *
 * `questionRef()` in worksheet-share.ts computes the same string for the link.
 * Kept as its own function here rather than imported so the basket does not
 * depend on the sharing module, but they must agree — a question that dedupes
 * one way and shares another would come back from its own link as a different
 * sheet.
 */
function identity(q: QuestionWithMetadata): string {
  return q.uid ?? `${q.year}-${q.paperNumber}-${q.questionIndex}`;
}

function getStorageKey(course: string) {
  return `worksheet_${course}`;
}

function loadFromSession(course: string): QuestionWithMetadata[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = sessionStorage.getItem(getStorageKey(course));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToSession(course: string, items: QuestionWithMetadata[]) {
  if (typeof window === 'undefined') return;
  try {
    if (items.length === 0) {
      sessionStorage.removeItem(getStorageKey(course));
    } else {
      sessionStorage.setItem(getStorageKey(course), JSON.stringify(items));
    }
  } catch {
    // sessionStorage full or unavailable — silently fail
  }
}

export function WorksheetProvider({ course, children }: { course: string; children: ReactNode }) {
  const [items, setItems] = useState<QuestionWithMetadata[]>(() => loadFromSession(course));

  // Sync to sessionStorage whenever items change
  useEffect(() => {
    saveToSession(course, items);
  }, [course, items]);

  const addItem = (question: QuestionWithMetadata) => {
    setItems((prev) => {
      // Prevent duplicates
      const id = identity(question);
      if (prev.some((q) => identity(q) === id)) return prev;
      return [...prev, question];
    });
  };

  const removeItem = (question: QuestionWithMetadata) => {
    const id = identity(question);
    setItems((prev) => prev.filter((q) => identity(q) !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const isInWorksheet = (question: QuestionWithMetadata) => {
    const id = identity(question);
    return items.some((q) => identity(q) === id);
  };

  const reorderItems = (fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      return newItems;
    });
  };

  return (
    <WorksheetContext.Provider
      value={{ items, addItem, removeItem, clearAll, isInWorksheet, reorderItems }}
    >
      {children}
    </WorksheetContext.Provider>
  );
}

export function useWorksheet() {
  const context = useContext(WorksheetContext);
  if (!context) {
    throw new Error('useWorksheet must be used within a WorksheetProvider');
  }
  return context;
}
