import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
import { UserApiSettings } from '../types/seo';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserApiSettings;
  onSaveSettings: (newSettings: UserApiSettings) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [provider, setProvider] = useState<'auto' | 'groq' | 'gemini'>(settings.preferredProvider || 'auto');
  const [groqKey, setGroqKey] = useState(settings.groqApiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProvider(settings.preferredProvider || 'auto');
    setGroqKey(settings.groqApiKey || '');
    setGeminiKey(settings.geminiApiKey || '');
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      preferredProvider: provider,
      groqApiKey: groqKey.trim(),
      geminiApiKey: geminiKey.trim(),
      hasEnvGroqKey: settings.hasEnvGroqKey,
      hasEnvGeminiKey: settings.hasEnvGeminiKey,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/80 rounded-lg text-amber-600 dark:text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                AI Provider & API Keys
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure Groq or Gemini API keys for custom generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-api-settings-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Preferred AI Engine Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('auto')}
                id="provider-auto-btn"
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  provider === 'auto'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/80 dark:border-indigo-400 dark:text-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Auto (Best Available)</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('groq')}
                id="provider-groq-btn"
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  provider === 'groq'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/80 dark:border-indigo-400 dark:text-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Groq API</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                id="provider-gemini-btn"
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  provider === 'gemini'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/80 dark:border-indigo-400 dark:text-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Gemini API</span>
              </button>
            </div>
          </div>

          {/* Groq Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom Groq API Key (gsk_...)
              </label>
              {settings.hasEnvGroqKey && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Detected in .env
                </span>
              )}
            </div>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
              id="groq-key-input"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Gemini Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom Gemini API Key (AIzaSy...)
              </label>
              {settings.hasEnvGeminiKey && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Detected in .env
                </span>
              )}
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxx"
              id="gemini-key-input"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Your API keys remain confidential and local. If no custom keys are entered, SEO Spark AI uses environment configuration or the high-speed local smart engine automatically.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              id="cancel-api-settings-btn"
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-api-settings-btn"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save API Preferences</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
