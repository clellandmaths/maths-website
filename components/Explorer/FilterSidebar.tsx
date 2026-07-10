'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronRight, X, Search } from 'lucide-react';
import { TopicCategory } from '@/lib/n5-topics';
import type { CourseTheme } from '@/lib/course-theme';

interface FilterSidebarProps {
  theme: CourseTheme;
  selectedSubtopics: string[];
  onSubtopicsChange: (subtopics: string[]) => void;
  selectedYears: (number | string)[];
  onYearsChange: (years: (number | string)[]) => void;
  selectedPapers: number[];
  onPapersChange: (papers: number[]) => void;
  questionCount: number;
  topicCategories: TopicCategory[];
  topics: Record<string, string[]>;
  availableYears: (number | string)[];
  // Higher Apps has one paper per year — no paper filter
  showPaperFilter?: boolean;
}

export default function FilterSidebar({
  theme,
  selectedSubtopics,
  onSubtopicsChange,
  selectedYears,
  onYearsChange,
  selectedPapers,
  onPapersChange,
  questionCount,
  topicCategories,
  topics,
  availableYears,
  showPaperFilter = true,
}: FilterSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [topicSearch, setTopicSearch] = useState('');

  const toggleMainTopic = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const toggleSubtopic = (subtopic: string) => {
    if (selectedSubtopics.includes(subtopic)) {
      onSubtopicsChange(selectedSubtopics.filter((s) => s !== subtopic));
    } else {
      onSubtopicsChange([...selectedSubtopics, subtopic]);
    }
  };

  const selectAllInTopic = (mainTopic: string) => {
    const subtopics = topics[mainTopic];
    const allSelected = subtopics.every((s) => selectedSubtopics.includes(s));

    if (allSelected) {
      onSubtopicsChange(selectedSubtopics.filter((s) => !subtopics.includes(s)));
    } else {
      const newSelected = [...selectedSubtopics];
      subtopics.forEach((s) => {
        if (!newSelected.includes(s)) {
          newSelected.push(s);
        }
      });
      onSubtopicsChange(newSelected);
    }
  };

  const toggleYear = (year: number | string) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter((y) => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  const togglePaper = (paper: number) => {
    if (selectedPapers.includes(paper)) {
      onPapersChange(selectedPapers.filter((p) => p !== paper));
    } else {
      onPapersChange([...selectedPapers, paper]);
    }
  };

  const clearFilters = () => {
    onSubtopicsChange([]);
    onYearsChange([]);
    onPapersChange([]);
  };

  const hasActiveFilters = selectedSubtopics.length > 0 || selectedYears.length > 0 || selectedPapers.length > 0;

  return (
    <aside className="w-72 border-r border-slate-800 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 p-6 bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className={`h-5 w-5 ${theme.text}`} />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 px-3 py-2 bg-slate-900 rounded-lg">
        <span className="text-sm text-slate-400">
          Showing <span className={`${theme.text} font-medium`}>{questionCount}</span> questions
        </span>
      </div>

      {/* Year Filter - Multi-select */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
          Year
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {availableYears.map((year) => (
            <label
              key={year}
              className="flex items-center gap-2 cursor-pointer group py-1"
            >
              <input
                type="checkbox"
                checked={selectedYears.includes(year)}
                onChange={() => toggleYear(year)}
                className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
              />
              <span className="text-slate-300 group-hover:text-slate-100 text-sm">
                {year}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Paper Filter — hidden for single-paper courses (Higher Apps) */}
      {showPaperFilter && (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
          Paper
        </h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer group py-1">
            <input
              type="checkbox"
              checked={selectedPapers.includes(1)}
              onChange={() => togglePaper(1)}
              className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
            />
            <span className="text-slate-300 group-hover:text-slate-100 text-sm">
              Paper 1 (Non-Calculator)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group py-1">
            <input
              type="checkbox"
              checked={selectedPapers.includes(2)}
              onChange={() => togglePaper(2)}
              className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
            />
            <span className="text-slate-300 group-hover:text-slate-100 text-sm">
              Paper 2 (Calculator)
            </span>
          </label>
        </div>
      </div>
      )}

      {/* Topic Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
          Topics
        </h3>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-8 pr-8 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-white/40"
          />
          {topicSearch && (
            <button onClick={() => setTopicSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300" />
            </button>
          )}
        </div>
        <div className="space-y-1">
          {topicCategories
            .filter(({ topics }) => {
              if (!topicSearch) return true;
              const query = topicSearch.toLowerCase();
              return Object.entries(topics).some(
                ([mainTopic, subtopics]) =>
                  mainTopic.toLowerCase().includes(query) ||
                  subtopics.some((s) => s.toLowerCase().includes(query))
              );
            })
            .map(({ category, topics }, catIndex) => (
            <div key={category}>
              {/* Category Header */}
              <h4 className={`text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${catIndex > 0 ? 'mt-4' : ''}`}>
                {category}
              </h4>
              {Object.entries(topics)
                .filter(([mainTopic, subtopics]) => {
                  if (!topicSearch) return true;
                  const query = topicSearch.toLowerCase();
                  return (
                    mainTopic.toLowerCase().includes(query) ||
                    subtopics.some((s) => s.toLowerCase().includes(query))
                  );
                })
                .map(([mainTopic, subtopics]) => {
                const query = topicSearch.toLowerCase();
                const visibleSubtopics = topicSearch
                  ? subtopics.filter((s) => s.toLowerCase().includes(query) || mainTopic.toLowerCase().includes(query))
                  : subtopics;
                const isExpanded = topicSearch ? true : expandedTopics[mainTopic];
                const selectedCount = subtopics.filter((s) =>
                  selectedSubtopics.includes(s)
                ).length;
                const allSelected = selectedCount === subtopics.length;
                const someSelected = selectedCount > 0 && !allSelected;

                // Single subtopic — render as flat checkbox, no expand
                if (subtopics.length === 1) {
                  return (
                    <div key={mainTopic} className="border-b border-slate-800/50 last:border-b-0">
                      <label className="flex items-center gap-2 cursor-pointer group py-2 pl-6">
                        <input
                          type="checkbox"
                          checked={selectedSubtopics.includes(subtopics[0])}
                          onChange={() => toggleSubtopic(subtopics[0])}
                          className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
                        />
                        <span className="text-slate-300 group-hover:text-slate-100 font-medium text-sm">
                          {mainTopic}
                        </span>
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={mainTopic} className="border-b border-slate-800/50 last:border-b-0">
                    {/* Main Topic Header */}
                    <div className="flex items-center gap-2 py-2">
                      <button
                        onClick={() => toggleMainTopic(mainTopic)}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer flex-1 group">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected;
                          }}
                          onChange={() => selectAllInTopic(mainTopic)}
                          className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
                        />
                        <span className="text-slate-300 group-hover:text-slate-100 font-medium text-sm">
                          {mainTopic}
                        </span>
                        {selectedCount > 0 && (
                          <span className={`text-xs ${theme.text}`}>({selectedCount})</span>
                        )}
                      </label>
                    </div>

                    {/* Subtopics */}
                    {isExpanded && (
                      <div className="pl-8 pb-2 space-y-1">
                        {visibleSubtopics.map((subtopic) => (
                          <label
                            key={subtopic}
                            className="flex items-center gap-2 cursor-pointer group py-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubtopics.includes(subtopic)}
                              onChange={() => toggleSubtopic(subtopic)}
                              className={`w-4 h-4 rounded border-slate-600 bg-slate-800 ${theme.text} focus:ring-white/30 focus:ring-offset-slate-900`}
                            />
                            <span className="text-slate-400 group-hover:text-slate-300 text-sm">
                              {subtopic}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase">Active</h4>
          <div className="flex flex-wrap gap-1">
            {selectedYears.map((year) => (
              <button
                key={`year-${year}`}
                onClick={() => toggleYear(year)}
                className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full flex items-center gap-1 hover:bg-slate-700"
              >
                {year}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedPapers.map((paper) => (
              <button
                key={`paper-${paper}`}
                onClick={() => togglePaper(paper)}
                className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full flex items-center gap-1 hover:bg-slate-700"
              >
                P{paper}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedSubtopics.slice(0, 5).map((subtopic) => (
              <button
                key={subtopic}
                onClick={() => toggleSubtopic(subtopic)}
                className={`px-2 py-1 ${theme.tint} ${theme.text} text-xs rounded-full flex items-center gap-1 hover:bg-white/10`}
              >
                {subtopic.length > 15 ? subtopic.slice(0, 15) + '...' : subtopic}
                <X className="h-3 w-3" />
              </button>
            ))}
            {selectedSubtopics.length > 5 && (
              <span className="px-2 py-1 text-slate-500 text-xs">
                +{selectedSubtopics.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
