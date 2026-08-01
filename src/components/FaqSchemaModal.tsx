import React from 'react';
import { X, Copy, Check, Code2, Sparkles } from 'lucide-react';

interface FaqSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemaJsonLd: string;
  onCopy: (text: string, label: string) => void;
  copied: boolean;
}

export const FaqSchemaModal: React.FC<FaqSchemaModalProps> = ({
  isOpen,
  onClose,
  schemaJsonLd,
  onCopy,
  copied,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                FAQ Schema Markup (JSON-LD)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste into your page &lt;head&gt; tag for Google FAQ Rich Snippets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-schema-modal-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Code View */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          <div className="relative">
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
              <code>{`<script type="application/ld+json">\n${schemaJsonLd}\n</script>`}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Valid Schema.org/FAQPage format
          </span>

          <button
            onClick={() => onCopy(`<script type="application/ld+json">\n${schemaJsonLd}\n</script>`, 'FAQ Schema Code')}
            id="copy-faq-schema-btn"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Schema Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
