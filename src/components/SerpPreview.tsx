import React, { useState } from 'react';
import { Smartphone, Monitor, Globe, ExternalLink } from 'lucide-react';

interface SerpPreviewProps {
  title: string;
  metaDescription: string;
  slug: string;
  domain?: string;
}

export const SerpPreview: React.FC<SerpPreviewProps> = ({
  title,
  metaDescription,
  slug,
  domain = 'example.com',
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const formattedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayUrl = `https://${formattedDomain} › blog › ${slug || 'post-title'}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 font-sans text-left">
      {/* Device Switcher Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Google SERP Snippet Simulator
          </span>
        </div>

        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setDevice('desktop')}
            id="serp-desktop-toggle-btn"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              device === 'desktop'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            id="serp-mobile-toggle-btn"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              device === 'mobile'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Google Result Box */}
      <div
        className={`bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-all ${
          device === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
        }`}
      >
        {/* Favicon & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-1">
          <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600">
            {formattedDomain.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate">
            <span className="font-medium text-slate-900 dark:text-slate-100">{formattedDomain}</span>
            <span className="text-slate-400">› blog › {slug || 'article-slug'}</span>
          </div>
        </div>

        {/* Title Tag */}
        <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-1 mb-1">
          {title || 'Your SEO Title Will Appear Here'}
        </h3>

        {/* Meta Description */}
        <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
          {metaDescription || 'Your optimized meta description snippet will render here, showing keywords and call to action.'}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
        <span>Title chars: {title.length} | Meta chars: {metaDescription.length}</span>
        <span className="flex items-center gap-1">
          <span>Pixel limit gauge safe</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
