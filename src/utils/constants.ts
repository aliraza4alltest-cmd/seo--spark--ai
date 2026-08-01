import { CountryOption, LanguageOption, ContentIntent, ToneOfVoice, ContentType } from '../types/seo';

export const CONTENT_TYPES: ContentType[] = [
  'Blog Post',
  'E-commerce Product',
  'Landing Page',
  'Ultimate Guide',
  'SaaS / Service Page',
  'Local Business',
];

export const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
];

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export const INTENTS: ContentIntent[] = [
  'Commercial',
  'Informational',
  'Transactional',
  'Navigational',
];

export const TONES: ToneOfVoice[] = [
  'Professional',
  'Engaging',
  'Authoritative',
  'Conversational',
  'Punchy & Direct',
  'Educational',
];

export const SAMPLE_KEYWORDS = [
  { keyword: 'Best running shoes for flat feet', category: 'E-Commerce / Health' },
  { keyword: 'AI marketing strategy 2026', category: 'SaaS / Marketing' },
  { keyword: 'How to clean cast iron skillet', category: 'Lifestyle / Cooking' },
  { keyword: 'CRM software comparison for startups', category: 'B2B Tech' },
  { keyword: 'Monstera plant care guide', category: 'Home & Garden' },
];
