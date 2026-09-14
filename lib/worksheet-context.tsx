'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuestionWithMetadata } from './data-loader';

export interface WorksheetContextType {
  items: QuestionWithMetadata[];
  addItem: (question: QuestionWithMetadata) => void;
  removeItem: (question: QuestionWithMetadata) => void;
  /** Swap one question for another, keeping its position on the sheet. */
  replaceItem: (question: QuestionWithMetadata, next: QuestionWithMetadata) => void;
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

  /**
   * Swap one question for another without moving it.
   *
   * Re-rolling question 3 should give a new question 3, not send it to the end
   * of the sheet. Doing that as remove-then-add works only by accident — the
   * list is the same length afterwards, so a position captured before the
   * change happens to still point at the right slot — and it stops being true
   * as soon as anything else touches the basket in between.
   */
  const replaceItem = (question: QuestionWithMetadata, next: QuestionWithMetadata) => {
    const id = identity(question);
    setItems((prev) => {
      const at = prev.findIndex((q) => identity(q) === id);
      if (at === -1) return prev;
      const out = [...prev];
      out[at] = next;
      return out;
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
      value={{ items, addItem, removeItem, replaceItem, clearAll, isInWorksheet, reorderItems }}
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

/**
 * The basket if there is one, and null if not — for controls that render on
 * pages outside the Explorer.
 *
 * Practice, notes and paper pages have no `WorksheetProvider`, so `useWorksheet`
 * throws there. A control that must work on all of them needs to ask rather
 * than assume.
 */
export function useWorksheetOptional(): WorksheetContextType | null {
  return useContext(WorksheetContext);
}

/**
 * Add questions to a course's basket without a provider, and say how many were
 * new.
 *
 * **Why not just mount a second provider around the control.** That is the
 * obvious move and it is wrong: two providers each hold their own `items` and
 * each write `worksheet_<course>` on every change, so whichever renders last
 * overwrites the other and questions disappear. There is one basket per course
 * because there is one storage key per course.
 *
 * Dedupes on the same `identity()` the provider uses, so a question added from
 * a practice page and the same question added in the Explorer are one entry.
 */
export function appendToSession(
  course: string,
  questions: readonly QuestionWithMetadata[],
): number {
  const existing = loadFromSession(course);
  const seen = new Set(existing.map(identity));
  const fresh = questions.filter((q) => {
    const id = identity(q);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  if (fresh.length) saveToSession(course, [...existing, ...fresh]);
  return fresh.length;
}

/**
 * What is already in a course's basket, for use as a generator exclude set.
 *
 * Without an exclude set the engine has no memory between calls: ten clicks on
 * a six-deep pool gave six byte-identical repeats.
 */
export function sessionItems(course: string): QuestionWithMetadata[] {
  return loadFromSession(course);
}
