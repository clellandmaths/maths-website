'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, FileText, Eye } from 'lucide-react';
import { useWorksheet } from '@/lib/worksheet-context';
import { getMainTopic } from '@/lib/n5-topics';
import type { CourseTheme } from '@/lib/course-theme';

interface WorksheetDrawerProps {
  theme: CourseTheme;
  isOpen: boolean;
  onClose: () => void;
  onViewOnWeb?: () => void;
}

export default function WorksheetDrawer({ theme, isOpen, onClose, onViewOnWeb }: WorksheetDrawerProps) {
  const { items, removeItem, clearAll, reorderItems } = useWorksheet();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastMovedIndex, setLastMovedIndex] = useState<number | null>(null);

  const handleReorder = (from: number, to: number) => {
    reorderItems(from, to);
    setLastMovedIndex(to);
  };

  useEffect(() => {
    if (lastMovedIndex !== null) {
      const timer = setTimeout(() => setLastMovedIndex(null), 800);
      return () => clearTimeout(timer);
    }
  }, [lastMovedIndex]);

  const moveUp = (index: number) => {
    if (index > 0) {
      handleReorder(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < items.length - 1) {
      handleReorder(index, index + 1);
    }
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className={`h-5 w-5 ${theme.text}`} />
            <h2 className="text-lg font-semibold">My Worksheet</h2>
            <span className={`px-2 py-0.5 ${theme.tint} ${theme.text} text-sm rounded-full`}>
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-300 rounded-lg hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No questions added yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Click &quot;+ Add&quot; on questions to build your worksheet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const mainTopic = item.topics?.[0] ? getMainTopic(item.topics[0]) : null;
                return (
                  <div
                    key={`${item.year}-${item.paperNumber}-${item.questionIndex}`}
                    className={`bg-slate-800 rounded-lg p-3 group${index === lastMovedIndex ? ' card-just-moved' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Question info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-300">
                            Q{index + 1}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.year} P{item.paperNumber} Q{item.questionIndex + 1}
                          </span>
                        </div>
                        {mainTopic && (
                          <span className="inline-block px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                            {mainTopic}
                          </span>
                        )}
                        {item.topics?.[0] && (
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {item.topics[0]}
                          </p>
                        )}
                      </div>

                      {/* Reorder buttons — compact horizontal */}
                      <div className="flex items-center gap-0 shrink-0">
                        <button
                          onClick={() => handleReorder(index, 0)}
                          disabled={index === 0}
                          className="hidden lg:block p-0.5 text-slate-600 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Move to top"
                        >
                          <ChevronsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-2 lg:p-0.5 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <ChevronUp className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === items.length - 1}
                          className="p-2 lg:p-0.5 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="h-5 w-5 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          onClick={() => handleReorder(index, items.length - 1)}
                          disabled={index === items.length - 1}
                          className="hidden lg:block p-0.5 text-slate-600 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Move to bottom"
                        >
                          <ChevronsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 p-4 space-y-3">
            <div className="flex flex-col gap-2">
              {onViewOnWeb && (
                <button
                  onClick={onViewOnWeb}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-lg text-sm font-medium transition-all`}
                >
                  <Eye className="h-4 w-4" />
                  View &amp; Print Worksheet
                </button>
              )}
              <button
                onClick={handleClearAll}
                className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  showClearConfirm
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {showClearConfirm ? 'Are you sure? Click to confirm' : 'Clear All'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
