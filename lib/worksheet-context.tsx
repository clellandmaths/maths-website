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
      const exists = prev.some(
        (q) =>
          q.year === question.year &&
          q.paperNumber === question.paperNumber &&
          q.questionIndex === question.questionIndex
      );
      if (exists) return prev;
      return [...prev, question];
    });
  };

  const removeItem = (question: QuestionWithMetadata) => {
    setItems((prev) =>
      prev.filter(
        (q) =>
          !(
            q.year === question.year &&
            q.paperNumber === question.paperNumber &&
            q.questionIndex === question.questionIndex
          )
      )
    );
  };

  const clearAll = () => {
    setItems([]);
  };

  const isInWorksheet = (question: QuestionWithMetadata) => {
    return items.some(
      (q) =>
        q.year === question.year &&
        q.paperNumber === question.paperNumber &&
        q.questionIndex === question.questionIndex
    );
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
