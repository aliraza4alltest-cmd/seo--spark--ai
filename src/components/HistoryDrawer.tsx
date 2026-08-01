import React from 'react';
import { X, History, Trash2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { SeoGenerationResult } from '../types/seo';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SeoGenerationResult[];
  onSelectHistory: (item: SeoGenerationResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 rounded-lg text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Recent SEO Reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} saved audit sessions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-history-drawer-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of History items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="font-medium text-sm text-slate-600 dark:text-slate-400">
                No saved generation history yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Generated SEO packages will automatically appear here for quick access.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-500"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {item.input.keyword}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-all group-hover:translate-x-0.5" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium">
                    {item.input.country}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium">
                    {item.input.intent}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <button
              onClick={onClearHistory}
              id="clear-all-history-btn"
              className="w-full py-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History ({history.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
