import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  FileText,
  HelpCircle,
  Hash,
  Link,
  Code2,
  ChevronDown,
  ChevronUp,
  Download,
  Gauge,
  Target,
  BookOpen,
  ListOrdered,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { SeoGenerationResult, TitleOption, MetaDescriptionOption } from '../types/seo';
import { SerpPreview } from './SerpPreview';

interface ResultsDashboardProps {
  result: SeoGenerationResult;
  onCopyText: (text: string, label: string) => void;
  onOpenSchemaModal: () => void;
  copiedId: string | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onCopyText,
  onOpenSchemaModal,
  copiedId,
}) => {
  const [selectedSerpTitle, setSelectedSerpTitle] = useState(
    result.titles[0]?.title || ''
  );
  const [selectedSerpMeta, setSelectedSerpMeta] = useState(
    result.metaDescriptions[0]?.description || ''
  );
  const [selectedSerpSlug, setSelectedSerpSlug] = useState(
    result.urlSlugs[0] || 'guide'
  );

  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(
    result.faqs[0]?.id || null
  );
  const [kwViewMode, setKwViewMode] = useState<'table' | 'grid'>('table');
  const [kwFilter, setKwFilter] = useState<string>('All');

  // Related keywords filter
  const filteredKeywords = result.relatedKeywords.filter((kw) => {
    if (kwFilter === 'All') return true;
    return kw.intent.toLowerCase() === kwFilter.toLowerCase();
  });

  // Helpers for full export
  const generateMarkdownReport = (): string => {
    return `# SEO Audit & Content Brief: ${result.input.keyword}

## 1. Overview
- **Target Keyword:** ${result.input.keyword}
- **Country:** ${result.input.country} | **Language:** ${result.input.language}
- **Search Intent:** ${result.overview.searchIntent}
- **Keyword Difficulty:** ${result.overview.keywordDifficulty}
- **Recommended Content Length:** ${result.overview.recommendedContentLength}
- **Strategy Tip:** ${result.overview.contentStrategyTip}

## 2. Optimized Title Tags
${result.titles.map((t) => `- ${t.title} (${t.characterCount} chars, Score: ${t.score}/100)`).join('\n')}

## 3. Meta Descriptions
${result.metaDescriptions.map((m) => `- ${m.description} (${m.characterCount} chars)`).join('\n')}

## 4. URL Slugs
${result.urlSlugs.map((s) => `- /${s}`).join('\n')}

## 5. Main H1 Headings
${result.h1Headings.map((h) => `- ${h}`).join('\n')}

## 6. Related Keywords
${result.relatedKeywords.map((k) => `- ${k.keyword} [${k.type}] (Vol: ${k.searchVolume}, KD: ${k.difficulty}%, Intent: ${k.intent})`).join('\n')}

## 7. Blog Outline
${result.blogOutline.sections.map((s) => `### ${s.heading} (${s.estimatedWords} words)\n${s.keyPoints.map((p) => `  * ${p}`).join('\n')}`).join('\n\n')}

## 8. FAQs
${result.faqs.map((f) => `**Q: ${f.question}**\nA: ${f.answer}`).join('\n\n')}
`;
  };

  const handleCopyMarkdownOutline = () => {
    const md = result.blogOutline.sections
      .map((s) => `${s.level === 'H2' ? '##' : '###'} ${s.heading}\n${s.keyPoints.map((p) => `- ${p}`).join('\n')}`)
      .join('\n\n');
    onCopyText(md, 'Blog Outline (Markdown)');
  };

  // Helpers for CSV export and downloads
  const downloadCsvFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTitlesCsv = () => {
    const header = 'Title,Character Count,Approx Pixel Width,SEO Score,Type,Power Words,Analysis\n';
    const rows = result.titles
      .map(
        (t) =>
          `"${t.title.replace(/"/g, '""')}",${t.characterCount},${t.pixelWidthApprox},${t.score},"${t.type}","${t.powerWords.join('; ')}","${t.analysis.replace(/"/g, '""')}"`
      )
      .join('\n');
    downloadCsvFile(header + rows, `seo-titles-${result.input.keyword.replace(/\s+/g, '-')}.csv`);
  };

  const handleExportMetaCsv = () => {
    const header = 'Meta Description,Character Count,SEO Score,Call To Action,Analysis\n';
    const rows = result.metaDescriptions
      .map(
        (m) =>
          `"${m.description.replace(/"/g, '""')}",${m.characterCount},${m.score},"${m.callToAction.replace(/"/g, '""')}","${m.analysis.replace(/"/g, '""')}"`
      )
      .join('\n');
    downloadCsvFile(header + rows, `seo-meta-descriptions-${result.input.keyword.replace(/\s+/g, '-')}.csv`);
  };

  const handleExportKeywordsCsv = () => {
    const csvHeader = 'Keyword,Type,Search Volume,Difficulty,Intent\n';
    const csvRows = result.relatedKeywords
      .map((k) => `"${k.keyword.replace(/"/g, '""')}","${k.type}","${k.searchVolume}",${k.difficulty},"${k.intent}"`)
      .join('\n');
    downloadCsvFile(csvHeader + csvRows, `seo-keywords-${result.input.keyword.replace(/\s+/g, '-')}.csv`);
  };

  const handleExportFullCsv = () => {
    const titlesSection = '--- SEO TITLES ---\nTitle,Character Count,Score,Type\n' +
      result.titles.map((t) => `"${t.title.replace(/"/g, '""')}",${t.characterCount},${t.score},"${t.type}"`).join('\n');

    const metaSection = '\n\n--- META DESCRIPTIONS ---\nMeta Description,Character Count,Score,CTA\n' +
      result.metaDescriptions.map((m) => `"${m.description.replace(/"/g, '""')}",${m.characterCount},${m.score},"${m.callToAction}"`).join('\n');

    const keywordsSection = '\n\n--- RELATED KEYWORDS ---\nKeyword,Type,Search Volume,Difficulty,Intent\n' +
      result.relatedKeywords.map((k) => `"${k.keyword.replace(/"/g, '""')}","${k.type}","${k.searchVolume}",${k.difficulty},"${k.intent}"`).join('\n');

    const fullCsv = `${titlesSection}${metaSection}${keywordsSection}`;
    downloadCsvFile(fullCsv, `full-seo-audit-${result.input.keyword.replace(/\s+/g, '-')}.csv`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navigation Jumper Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        <div className="flex items-center gap-1 min-w-max text-slate-600 dark:text-slate-300">
          <a href="#section-overview" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Overview</a>
          <a href="#section-titles" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Titles</a>
          <a href="#section-meta" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Meta Desc</a>
          <a href="#section-slugs" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Slugs</a>
          <a href="#section-h1s" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">H1 Headings</a>
          <a href="#section-keywords" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Keywords</a>
          <a href="#section-outline" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Outline</a>
          <a href="#section-faqs" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">FAQs</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullCsv}
            id="export-full-csv-btn"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs transition-all text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onCopyText(generateMarkdownReport(), 'Full SEO Brief (Markdown)')}
            id="copy-full-brief-btn"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs transition-all text-xs font-bold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Brief</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW METRICS */}
      <div id="section-overview" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Difficulty Metric */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Keyword Difficulty</span>
            <Gauge className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {result.overview.difficultyScore}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                result.overview.difficultyScore > 65
                  ? 'bg-rose-500'
                  : result.overview.difficultyScore > 35
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${result.overview.difficultyScore}%` }}
            />
          </div>
        </div>

        {/* Search Intent */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Search Intent</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {result.overview.searchIntent}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Targeting {result.input.country} market in {result.input.language}
          </p>
        </div>

        {/* Recommended Length */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Target Content Length</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {result.overview.recommendedContentLength}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Optimal length to outperform top 10 search results
          </p>
        </div>

        {/* Strategy Tip */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between border border-indigo-800">
          <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
            <span className="font-bold uppercase tracking-wider">AI Content Strategy</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <p className="text-xs leading-relaxed text-indigo-100">
            {result.overview.contentStrategyTip}
          </p>
        </div>
      </div>

      {/* SECTION 2: SEO TITLE GENERATOR */}
      <div id="section-titles" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                SEO Title Tag Generator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                5 CTR-optimized title tag variations (50-60 char safe zone)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTitlesCsv}
              id="export-titles-csv-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() =>
                onCopyText(
                  result.titles.map((t) => t.title).join('\n'),
                  'All Title Tags'
                )
              }
              id="copy-all-titles-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {result.titles.map((option: TitleOption) => (
            <div
              key={option.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      {option.type}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      Score: {option.score}/100
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {option.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedSerpTitle(option.title);
                    }}
                    id={`preview-title-btn-${option.id}`}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  >
                    Test in SERP
                  </button>

                  <button
                    onClick={() => onCopyText(option.title, option.title)}
                    id={`copy-title-btn-${option.id}`}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Copy Title"
                  >
                    {copiedId === option.title ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Character Count Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {option.characterCount} chars
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({option.characterCount >= 50 && option.characterCount <= 60 ? 'Ideal Length' : 'Acceptable'})
                  </span>
                </span>
                <p className="text-xs italic text-slate-500 dark:text-slate-400 truncate max-w-md">
                  {option.analysis}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: META DESCRIPTION GENERATOR & LIVE SERP SIMULATOR */}
      <div id="section-meta" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 dark:bg-violet-950/80 rounded-xl text-violet-600 dark:text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Meta Description Generator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-converting snippets with CTA (145-160 char target)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMetaCsv}
              id="export-meta-csv-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() =>
                onCopyText(
                  result.metaDescriptions.map((m) => m.description).join('\n\n'),
                  'All Meta Descriptions'
                )
              }
              id="copy-all-meta-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </button>
          </div>
        </div>

        {/* Live SERP Snippet Simulator Box */}
        <div className="mb-6">
          <SerpPreview
            title={selectedSerpTitle}
            metaDescription={selectedSerpMeta}
            slug={selectedSerpSlug}
            domain={result.input.domain || 'example.com'}
          />
        </div>

        <div className="space-y-4">
          {result.metaDescriptions.map((option: MetaDescriptionOption) => (
            <div
              key={option.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-violet-300 dark:hover:border-violet-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800">
                      {option.characterCount} chars
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      CTA: {option.callToAction}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedSerpMeta(option.description)}
                    id={`preview-meta-btn-${option.id}`}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  >
                    Test Snippet
                  </button>

                  <button
                    onClick={() => onCopyText(option.description, option.description)}
                    id={`copy-meta-btn-${option.id}`}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {copiedId === option.description ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                {option.analysis}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 & 5: URL SLUGS & H1 HEADINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slugs Card */}
        <div id="section-slugs" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Link className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  URL Slug Generator
                </h2>
              </div>
              <button
                onClick={() => onCopyText(result.urlSlugs.join('\n'), 'URL Slugs')}
                id="copy-all-slugs-btn"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Copy All
              </button>
            </div>

            <div className="space-y-2.5">
              {result.urlSlugs.map((slug, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                >
                  <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                    /{slug}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedSerpSlug(slug)}
                      className="px-2 py-0.5 text-[10px] font-sans font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => onCopyText(`/${slug}`, slug)}
                      id={`copy-slug-btn-${idx}`}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      {copiedId === slug ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* H1 Headings Card */}
        <div id="section-h1s" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/80 rounded-xl text-amber-600 dark:text-amber-400">
                  <Hash className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Main H1 Headlines
                </h2>
              </div>
              <button
                onClick={() => onCopyText(result.h1Headings.join('\n'), 'H1 Headings')}
                id="copy-all-h1s-btn"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Copy All
              </button>
            </div>

            <div className="space-y-2.5">
              {result.h1Headings.map((h1, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <span className="text-slate-900 dark:text-slate-100 leading-snug pr-2">
                    {h1}
                  </span>
                  <button
                    onClick={() => onCopyText(h1, h1)}
                    id={`copy-h1-btn-${idx}`}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0"
                  >
                    {copiedId === h1 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: RELATED KEYWORDS ENGINE */}
      <div id="section-keywords" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/80 rounded-xl text-blue-600 dark:text-blue-400">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Related & LSI Keywords Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Primary, long-tail, and LSI keyword suggestions with volume & KD%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Intent Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <Filter className="w-3 h-3 text-slate-400 ml-1" />
              {['All', 'Commercial', 'Informational', 'Transactional'].map((f) => (
                <button
                  key={f}
                  onClick={() => setKwFilter(f)}
                  id={`kw-filter-btn-${f}`}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    kwFilter === f
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white font-bold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportKeywordsCsv}
              id="export-keywords-csv-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Keyword</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Search Volume</th>
                <th className="py-3 px-3">Difficulty (KD)</th>
                <th className="py-3 px-3">Intent</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredKeywords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {item.keyword}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {item.searchVolume}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      item.difficulty > 50
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                    }`}>
                      {item.difficulty}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-medium">
                      {item.intent}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onCopyText(item.keyword, item.keyword)}
                      id={`copy-kw-btn-${item.id}`}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {copiedId === item.keyword ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 7: BLOG OUTLINE GENERATOR */}
      <div id="section-outline" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Structured Blog & Article Outline
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hierarchical H2/H3 headings with estimated word counts & bullet briefs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdownOutline}
              id="copy-outline-markdown-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Markdown</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Article Title: </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{result.blogOutline.title}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Target Length: </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.blogOutline.estimatedWordCount} words</span>
          </div>
        </div>

        <div className="space-y-4">
          {result.blogOutline.sections.map((section, idx) => (
            <div
              key={section.id || idx}
              className={`p-4 rounded-xl border transition-all ${
                section.level === 'H2'
                  ? 'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  : 'ml-4 sm:ml-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    section.level === 'H2'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                  }`}>
                    {section.level}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {section.heading}
                  </h3>
                </div>

                <span className="text-xs font-semibold text-slate-400 shrink-0">
                  ~{section.estimatedWords} words
                </span>
              </div>

              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                {section.keyPoints.map((point, pIdx) => (
                  <li key={pIdx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 8: FAQ GENERATOR & SCHEMA MARKUP */}
      <div id="section-faqs" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/80 rounded-xl text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Frequently Asked Questions (FAQs)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Targeting Featured Snippets & People Also Ask (PAA)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSchemaModal}
              id="open-schema-modal-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 rounded-xl border border-amber-200 dark:border-amber-800 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Get JSON-LD Schema</span>
            </button>

            <button
              onClick={() =>
                onCopyText(
                  result.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n'),
                  'All FAQs'
                )
              }
              id="copy-all-faqs-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy FAQs</span>
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {result.faqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full p-4 text-left bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 font-bold text-sm text-slate-900 dark:text-white"
                  id={`faq-accordion-toggle-${faq.id}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Q:</span>
                    {faq.question}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start justify-between gap-3">
                    <p className="flex-1">{faq.answer}</p>
                    <button
                      onClick={() => onCopyText(`Q: ${faq.question}\nA: ${faq.answer}`, faq.question)}
                      id={`copy-single-faq-btn-${faq.id}`}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 shrink-0"
                    >
                      {copiedId === faq.question ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
