import React, { useState } from 'react';
import {
  Search,
  Globe2,
  Building2,
  Globe,
  FileCode2,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  X,
  Type,
  FileText,
  KeyRound,
  FileCheck2,
  Zap,
  Target,
  Languages,
} from 'lucide-react';
import { COUNTRIES, LANGUAGES, INTENTS, TONES, CONTENT_TYPES, SAMPLE_KEYWORDS } from '../utils/constants';
import { SeoGenerationRequest, ContentIntent, ToneOfVoice, ContentType } from '../types/seo';

interface KeywordInputFormProps {
  onGenerate: (req: SeoGenerationRequest) => void;
  isLoading: boolean;
  activeAction?: string;
}

export const KeywordInputForm: React.FC<KeywordInputFormProps> = ({
  onGenerate,
  isLoading,
  activeAction,
}) => {
  const [keyword, setKeyword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState('United States');
  const [brandName, setBrandName] = useState('');
  const [contentType, setContentType] = useState<ContentType>('Blog Post');

  // Secondary/advanced settings
  const [language, setLanguage] = useState('English');
  const [intent, setIntent] = useState<ContentIntent>('Commercial');
  const [tone, setTone] = useState<ToneOfVoice>('Professional');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAction = (actionType: 'all' | 'title' | 'meta' | 'keywords' | 'brief') => {
    if (!keyword.trim() || isLoading) return;

    onGenerate({
      keyword: keyword.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      country,
      brandName: brandName.trim() || undefined,
      contentType,
      language,
      intent,
      tone,
      actionType,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction('all');
  };

  const handleSelectSample = (sampleKw: string) => {
    setKeyword(sampleKw);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 transition-all">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Focus Keyword Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>1. Focus Keyword</span>
            </span>
            <span className="text-[10px] text-rose-500 font-semibold">* Required</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. best running shoes for flat feet, SaaS marketing strategy..."
              className="w-full pl-4 pr-10 py-3.5 text-base font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
              required
              id="focus-keyword-input"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                id="clear-keyword-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sample Keywords */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Quick samples:
            </span>
            {SAMPLE_KEYWORDS.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(item.keyword)}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950 dark:text-slate-300 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors"
                id={`sample-keyword-btn-${idx}`}
              >
                {item.keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Input Grid for the remaining 4 requested inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 2. Website URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>2. Website URL</span>
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://mybrand.com"
              className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
              id="website-url-input"
            />
          </div>

          {/* 3. Target Country */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>3. Target Country</span>
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                id="target-country-select"
                className="w-full appearance-none px-3.5 py-2.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-8 cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 4. Brand Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>4. Brand Name</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. RunnerLab, Acme SEO"
              className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
              id="brand-name-input"
            />
          </div>

          {/* 5. Content Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>5. Content Type</span>
            </label>
            <div className="relative">
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                id="content-type-select"
                className="w-full appearance-none px-3.5 py-2.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-8 cursor-pointer"
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Collapsible Options (Language, Intent, Tone) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            id="toggle-advanced-btn"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Language & Tone Tuning' : 'Language, Intent & Tone Tuning'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span>Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  id="language-select"
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.name}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search Intent</span>
                </label>
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value as ContentIntent)}
                  id="intent-select"
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INTENTS.map((i) => (
                    <option key={i} value={i}>
                      {i} Intent
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tone of Voice</span>
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneOfVoice)}
                  id="tone-select"
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Choose Targeted Generation Action</span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">Click any button below to trigger</span>
          </div>

          {/* 4 Targeted Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              disabled={isLoading || !keyword.trim()}
              onClick={() => handleAction('title')}
              id="generate-title-btn"
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-indigo-950 dark:text-slate-200 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <Type className="w-4 h-4 text-indigo-500" />
              <span>Generate SEO Title</span>
            </button>

            <button
              type="button"
              disabled={isLoading || !keyword.trim()}
              onClick={() => handleAction('meta')}
              id="generate-meta-btn"
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-violet-50 text-slate-800 hover:text-violet-700 dark:bg-slate-800 dark:hover:bg-violet-950 dark:text-slate-200 dark:hover:text-violet-300 border border-slate-200 dark:border-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <FileText className="w-4 h-4 text-violet-500" />
              <span>Generate Meta Description</span>
            </button>

            <button
              type="button"
              disabled={isLoading || !keyword.trim()}
              onClick={() => handleAction('keywords')}
              id="generate-keywords-btn"
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-blue-950 dark:text-slate-200 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-blue-500" />
              <span>Generate Keywords</span>
            </button>

            <button
              type="button"
              disabled={isLoading || !keyword.trim()}
              onClick={() => handleAction('brief')}
              id="generate-brief-btn"
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:text-slate-200 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <span>Generate Content Brief</span>
            </button>
          </div>

          {/* Primary Full Suite Button */}
          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            id="generate-seo-btn"
            className="w-full py-3.5 px-6 rounded-xl font-extrabold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/25 dark:shadow-indigo-900/40 flex items-center justify-center gap-2 text-sm tracking-wide transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Generating SEO Package...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Generate Full SEO Suite (All Assets)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
