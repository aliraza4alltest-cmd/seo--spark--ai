export type ContentIntent = 'Commercial' | 'Informational' | 'Transactional' | 'Navigational';

export type ToneOfVoice = 'Professional' | 'Engaging' | 'Authoritative' | 'Conversational' | 'Punchy & Direct' | 'Educational';

export type ContentType = 'Blog Post' | 'E-commerce Product' | 'Landing Page' | 'Ultimate Guide' | 'SaaS / Service Page' | 'Local Business';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface TitleOption {
  id: string;
  title: string;
  characterCount: number;
  pixelWidthApprox: number;
  score: number;
  type: string;
  powerWords: string[];
  analysis: string;
}

export interface MetaDescriptionOption {
  id: string;
  description: string;
  characterCount: number;
  score: number;
  callToAction: string;
  analysis: string;
}

export interface RelatedKeywordItem {
  id: string;
  keyword: string;
  type: 'Primary' | 'LSI Keyword' | 'Long-Tail' | 'Question Query';
  searchVolume: string;
  difficulty: number; // 0 - 100
  intent: ContentIntent;
}

export interface BlogOutlineSection {
  id: string;
  heading: string;
  level: 'H2' | 'H3';
  estimatedWords: number;
  keyPoints: string[];
}

export interface BlogOutline {
  title: string;
  estimatedWordCount: number;
  targetAudience: string;
  sections: BlogOutlineSection[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SeoOverview {
  keywordDifficulty: string;
  difficultyScore: number;
  searchIntent: string;
  recommendedContentLength: string;
  contentStrategyTip: string;
  primaryCategory: string;
}

export interface SeoGenerationResult {
  id: string;
  timestamp: number;
  input: {
    keyword: string;
    websiteUrl?: string;
    country: string;
    language: string;
    intent: ContentIntent;
    tone: ToneOfVoice;
    brandName?: string;
    contentType?: ContentType;
    domain?: string;
  };
  overview: SeoOverview;
  titles: TitleOption[];
  metaDescriptions: MetaDescriptionOption[];
  urlSlugs: string[];
  h1Headings: string[];
  relatedKeywords: RelatedKeywordItem[];
  blogOutline: BlogOutline;
  faqs: FaqItem[];
  faqSchemaJsonLd: string;
  generatedModule?: 'all' | 'title' | 'meta' | 'keywords' | 'brief';
}

export interface SeoGenerationRequest {
  keyword: string;
  websiteUrl?: string;
  country: string;
  language: string;
  intent: ContentIntent;
  tone: ToneOfVoice;
  brandName?: string;
  contentType?: ContentType;
  domain?: string;
  provider?: 'auto' | 'groq' | 'gemini';
  customApiKey?: string;
  actionType?: 'all' | 'title' | 'meta' | 'keywords' | 'brief';
}

export interface UserApiSettings {
  preferredProvider: 'auto' | 'groq' | 'gemini';
  groqApiKey: string;
  geminiApiKey: string;
  hasEnvGroqKey?: boolean;
  hasEnvGeminiKey?: boolean;
}
