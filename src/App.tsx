import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KeywordInputForm } from './components/KeywordInputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { FaqSchemaModal } from './components/FaqSchemaModal';
import { Toast } from './components/Toast';

import {
  SeoGenerationRequest,
  SeoGenerationResult,
  UserApiSettings,
} from './types/seo';
import { generateSeoData, fetchServerConfig } from './services/api';
import { Sparkles, Shield, Zap, Search, Globe, ChevronRight } from 'lucide-react';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('seo_spark_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('seo_spark_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // App States
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<SeoGenerationResult | null>(null);
  
  // History persistent state
  const [history, setHistory] = useState<SeoGenerationResult[]>(() => {
    try {
      const saved = localStorage.getItem('seo_spark_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('seo_spark_history', JSON.stringify(history));
    } catch (err) {
      console.warn('Unable to save history to localStorage:', err);
    }
  }, [history]);

  // API settings state
  const [apiSettings, setApiSettings] = useState<UserApiSettings>(() => {
    try {
      const saved = localStorage.getItem('seo_spark_api_settings');
      return saved
        ? JSON.parse(saved)
        : {
            preferredProvider: 'auto',
            groqApiKey: '',
            geminiApiKey: '',
          };
    } catch {
      return {
        preferredProvider: 'auto',
        groqApiKey: '',
        geminiApiKey: '',
      };
    }
  });

  // Check server environment keys on load
  useEffect(() => {
    fetchServerConfig().then((cfg) => {
      setApiSettings((prev) => ({
        ...prev,
        hasEnvGroqKey: cfg.hasGroqKey,
        hasEnvGeminiKey: cfg.hasGeminiKey,
      }));
    });
  }, []);

  const handleSaveApiSettings = (newSettings: UserApiSettings) => {
    setApiSettings(newSettings);
    localStorage.setItem('seo_spark_api_settings', JSON.stringify(newSettings));
    showToast('API preferences saved successfully', 'success');
  };

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Toast & Clipboard Feedback
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    showToast(`Copied "${label.length > 30 ? label.slice(0, 30) + '...' : label}" to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Generation Handler
  const handleGenerate = async (req: SeoGenerationRequest) => {
    setIsLoading(true);
    try {
      const fullReq: SeoGenerationRequest = {
        ...req,
        provider: apiSettings.preferredProvider,
        customApiKey:
          apiSettings.preferredProvider === 'groq'
            ? apiSettings.groqApiKey
            : apiSettings.preferredProvider === 'gemini'
            ? apiSettings.geminiApiKey
            : apiSettings.groqApiKey || apiSettings.geminiApiKey || '',
      };

      const result = await generateSeoData(fullReq);
      setCurrentResult(result);
      setHistory((prev) => [result, ...prev.filter((h) => h.id !== result.id)].slice(0, 20));
      showToast(`Generated full SEO package for "${req.keyword}"`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('seo_spark_history');
    showToast('Cleared search history', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        hasResults={Boolean(currentResult)}
        onExportPdfReport={
          currentResult
            ? () =>
                handleCopyText(
                  `# ${currentResult.input.keyword} - SEO Brief\n\nTitles:\n` +
                    currentResult.titles.map((t) => `- ${t.title}`).join('\n'),
                  'Full Report'
                )
            : undefined
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro / Hero Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Powered SEO & Content Strategy Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Spark High-Ranking Content in Seconds
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Generate Title Tags, Meta Descriptions, Clean URL Slugs, H1 Headings, Related LSI Keywords, Blog Outlines, and FAQ JSON-LD Schema.
          </p>
        </div>

        {/* Input Form */}
        <KeywordInputForm onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Results Dashboard or Empty State */}
        {currentResult ? (
          <ResultsDashboard
            result={currentResult}
            onCopyText={handleCopyText}
            onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
            copiedId={copiedId}
          />
        ) : (
          <div className="bg-white/60 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-6 h-6" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Ready to generate your SEO package?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your target keyword above and click "Generate Complete SEO Package" to generate titles, metas, outlines, keywords, and FAQ schema.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-left text-xs font-semibold">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Multi-Country & Multi-Lang</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Groq & Gemini AI Integration</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SERP Snippet Simulator</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
                <span>FAQ Schema Generator</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-200">SEO Spark AI</span>
            <span>•</span>
            <span>Production-Ready SEO Generator</span>
          </div>

          <p>Built for Marketers, Content Creators & Founders</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={(item) => setCurrentResult(item)}
        onClearHistory={handleClearHistory}
      />

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        settings={apiSettings}
        onSaveSettings={handleSaveApiSettings}
      />

      {currentResult && (
        <FaqSchemaModal
          isOpen={isSchemaModalOpen}
          onClose={() => setIsSchemaModalOpen(false)}
          schemaJsonLd={currentResult.faqSchemaJsonLd}
          onCopy={handleCopyText}
          copied={copiedId === 'FAQ Schema Code'}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
