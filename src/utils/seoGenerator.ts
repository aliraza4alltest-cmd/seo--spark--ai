import {
  SeoGenerationRequest,
  SeoGenerationResult,
  TitleOption,
  MetaDescriptionOption,
  RelatedKeywordItem,
  BlogOutline,
  FaqItem,
} from '../types/seo';

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateLocalSeoData(
  req: SeoGenerationRequest
): SeoGenerationResult {
  const {
    keyword,
    websiteUrl = '',
    country = 'United States',
    language = 'English',
    intent = 'Commercial',
    tone = 'Professional',
    brandName = '',
    contentType = 'Blog Post',
    domain = 'example.com',
    actionType = 'all',
  } = req;

  const rawKeyword = keyword.trim();
  const cleanKeyword = capitalizeWords(rawKeyword);
  const baseSlug = generateSlug(rawKeyword);
  const effectiveDomain = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').split('/')[0] : domain;
  const brandSuffix = brandName ? ` | ${brandName}` : (effectiveDomain && effectiveDomain !== 'example.com' ? ` | ${effectiveDomain}` : '');
  const currentYear = new Date().getFullYear();

  // 1. Title Options
  const titles: TitleOption[] = [
    {
      id: 'title-1',
      title: `${cleanKeyword}: ${contentType} Guide (${currentYear})${brandSuffix}`,
      characterCount: `${cleanKeyword}: ${contentType} Guide (${currentYear})${brandSuffix}`.length,
      pixelWidthApprox: Math.round((`${cleanKeyword}: ${contentType} Guide (${currentYear})${brandSuffix}`.length) * 9.2),
      score: 96,
      type: 'Listicle / Ultimate Guide',
      powerWords: ['Complete Guide', `${currentYear}`],
      analysis: 'Front-loads primary keyword, incorporates current year hook for fresh query intent.',
    },
    {
      id: 'title-2',
      title: `10 Best ${cleanKeyword} Options in ${currentYear} [Expert Tested]${brandSuffix}`,
      characterCount: `10 Best ${cleanKeyword} Options in ${currentYear} [Expert Tested]${brandSuffix}`.length,
      pixelWidthApprox: Math.round((`10 Best ${cleanKeyword} Options in ${currentYear} [Expert Tested]${brandSuffix}`.length) * 9.2),
      score: 98,
      type: 'High CTR Listicle',
      powerWords: ['Best', 'Expert Tested', 'Top Rated'],
      analysis: 'High CTR format with emotional trust trigger [Expert Tested] and listicle number.',
    },
    {
      id: 'title-3',
      title: `How to Choose ${cleanKeyword}: Everything You Need to Know${brandSuffix}`,
      characterCount: `How to Choose ${cleanKeyword}: Everything You Need to Know${brandSuffix}`.length,
      pixelWidthApprox: Math.round((`How to Choose ${cleanKeyword}: Everything You Need to Know${brandSuffix}`.length) * 9.2),
      score: 91,
      type: 'How-To / Educational',
      powerWords: ['How to Choose', 'Need to Know'],
      analysis: 'Matches informational & investigational intent with a clear learning promise.',
    },
    {
      id: 'title-4',
      title: `Why ${cleanKeyword} Matters & How to Get Started Today${brandSuffix}`,
      characterCount: `Why ${cleanKeyword} Matters & How to Get Started Today${brandSuffix}`.length,
      pixelWidthApprox: Math.round((`Why ${cleanKeyword} Matters & How to Get Started Today${brandSuffix}`.length) * 9.2),
      score: 89,
      type: 'Action-Oriented',
      powerWords: ['Get Started', 'Today', 'Why'],
      analysis: 'Spurs immediate user action with strong urgency power words.',
    },
    {
      id: 'title-5',
      title: `${cleanKeyword} Comparison: Pros, Cons & Pricing Guide`,
      characterCount: `${cleanKeyword} Comparison: Pros, Cons & Pricing Guide`.length,
      pixelWidthApprox: Math.round((`${cleanKeyword} Comparison: Pros, Cons & Pricing Guide`.length) * 9.2),
      score: 93,
      type: 'Commercial Intent',
      powerWords: ['Comparison', 'Pros', 'Cons', 'Pricing'],
      analysis: 'Targets high-converting bottom of funnel searchers weighing options.',
    },
  ];

  // 2. Meta Descriptions
  const metaDescriptions: MetaDescriptionOption[] = [
    {
      id: 'meta-1',
      description: `Looking for top-rated ${rawKeyword}? Explore our comprehensive ${currentYear} guide covering expert reviews, comparisons, and key factors to make the right choice. Click to learn more!`,
      characterCount: `Looking for top-rated ${rawKeyword}? Explore our comprehensive ${currentYear} guide covering expert reviews, comparisons, and key factors to make the right choice. Click to learn more!`.length,
      score: 98,
      callToAction: 'Click to learn more!',
      analysis: 'Optimal character length (approx 150-155 chars). Features primary target keyword early and clear call-to-action.',
    },
    {
      id: 'meta-2',
      description: `Master ${rawKeyword} with our step-by-step breakdown. Discover proven strategies, expert recommendations, and actionable tips for ${country} users. Read the full guide today!`,
      characterCount: `Master ${rawKeyword} with our step-by-step breakdown. Discover proven strategies, expert recommendations, and actionable tips for ${country} users. Read the full guide today!`.length,
      score: 94,
      callToAction: 'Read the full guide today!',
      analysis: 'Strong action-oriented verb opening with target geo relevance for ' + country + '.',
    },
    {
      id: 'meta-3',
      description: `Compare the best ${rawKeyword} solutions in ${country}. Get unbiased analysis, pros & cons, pricing breakdowns, and expert tips to maximize your results. Get started now!`,
      characterCount: `Compare the best ${rawKeyword} solutions in ${country}. Get unbiased analysis, pros & cons, pricing breakdowns, and expert tips to maximize your results. Get started now!`.length,
      score: 92,
      callToAction: 'Get started now!',
      analysis: 'Commercial focus tailored for searchers seeking high value and comparisons.',
    },
  ];

  // 3. Slugs
  const urlSlugs = [
    `${baseSlug}`,
    `best-${baseSlug}`,
    `${baseSlug}-guide`,
    `top-${baseSlug}-${currentYear}`,
  ];

  // 4. H1 Headings
  const h1Headings = [
    `The Ultimate Guide to ${cleanKeyword} in ${currentYear}`,
    `10 Best ${cleanKeyword} Options Tested & Reviewed`,
    `How to Master ${cleanKeyword}: A Step-by-Step Practical Blueprint`,
    `${cleanKeyword} Comparison: Top Picks & Expert Recommendations`,
    `Everything You Need to Know About ${cleanKeyword}`,
  ];

  // 5. Related Keywords
  const relatedKeywords: RelatedKeywordItem[] = [
    {
      id: 'kw-1',
      keyword: `${rawKeyword} best practices`,
      type: 'LSI Keyword',
      searchVolume: '18,500/mo',
      difficulty: 45,
      intent: 'Informational',
    },
    {
      id: 'kw-2',
      keyword: `how to choose ${rawKeyword}`,
      type: 'Long-Tail',
      searchVolume: '12,200/mo',
      difficulty: 38,
      intent: 'Informational',
    },
    {
      id: 'kw-3',
      keyword: `${rawKeyword} cost and pricing`,
      type: 'Primary',
      searchVolume: '9,800/mo',
      difficulty: 52,
      intent: 'Transactional',
    },
    {
      id: 'kw-4',
      keyword: `top rated ${rawKeyword} for beginners`,
      type: 'Long-Tail',
      searchVolume: '6,400/mo',
      difficulty: 29,
      intent: 'Commercial',
    },
    {
      id: 'kw-5',
      keyword: `what is ${rawKeyword} used for`,
      type: 'Question Query',
      searchVolume: '22,100/mo',
      difficulty: 34,
      intent: 'Informational',
    },
    {
      id: 'kw-6',
      keyword: `${rawKeyword} vs alternatives`,
      type: 'LSI Keyword',
      searchVolume: '8,100/mo',
      difficulty: 48,
      intent: 'Commercial',
    },
    {
      id: 'kw-7',
      keyword: `buy ${rawKeyword} online in ${country}`,
      type: 'Primary',
      searchVolume: '5,300/mo',
      difficulty: 61,
      intent: 'Transactional',
    },
  ];

  // 6. Blog Outline
  const blogOutline: BlogOutline = {
    title: `The Comprehensive ${cleanKeyword} Guide for ${currentYear}`,
    estimatedWordCount: 2200,
    targetAudience: `Users seeking expert insights, reviews, or step-by-step implementation for ${rawKeyword} in ${country}.`,
    sections: [
      {
        id: 'sec-1',
        heading: `1. Introduction: What is ${cleanKeyword} and Why It Matters`,
        level: 'H2',
        estimatedWords: 300,
        keyPoints: [
          `Define ${rawKeyword} clearly in simple, accessible language.`,
          `Highlight primary industry trends and demand in ${country}.`,
          `Overview of what readers will learn in this actionable guide.`,
        ],
      },
      {
        id: 'sec-2',
        heading: `2. Key Benefits & Core Advantages of ${cleanKeyword}`,
        level: 'H2',
        estimatedWords: 450,
        keyPoints: [
          `Top 3-5 high-impact benefits for businesses and individuals.`,
          `Real-world ROI and performance metrics.`,
          `Common mistakes to avoid when getting started.`,
        ],
      },
      {
        id: 'sec-3',
        heading: `3. Step-by-Step Implementation Framework`,
        level: 'H2',
        estimatedWords: 600,
        keyPoints: [
          `Step 1: Preparation, initial setup, and prerequisites.`,
          `Step 2: Core execution strategies and best practices.`,
          `Step 3: Optimization, tracking, and scaling results over time.`,
        ],
      },
      {
        id: 'sec-4',
        heading: `4. Top Features to Look For When Evaluating Options`,
        level: 'H3',
        estimatedWords: 350,
        keyPoints: [
          `Comparison table of key parameters.`,
          `Budget vs premium options.`,
          `Integration and compatibility criteria.`,
        ],
      },
      {
        id: 'sec-5',
        heading: `5. Frequently Asked Questions Regarding ${cleanKeyword}`,
        level: 'H2',
        estimatedWords: 300,
        keyPoints: [
          `Address key user questions to capture Featured Snippets.`,
          `Direct, concise 2-3 sentence answers for schema markup optimization.`,
        ],
      },
      {
        id: 'sec-6',
        heading: `6. Conclusion & Next Action Steps`,
        level: 'H2',
        estimatedWords: 200,
        keyPoints: [
          `Summarize core takeaways.`,
          `Provide clear call to action to engage with ${brandName || domain}.`,
        ],
      },
    ],
  };

  // 7. FAQs
  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: `What is ${rawKeyword} and how does it work?`,
      answer: `${cleanKeyword} refers to the method, tool, or process designed to solve key needs in its domain. By understanding core principles and applying best practices, users in ${country} can achieve optimal performance and long-term results.`,
      category: 'General',
    },
    {
      id: 'faq-2',
      question: `How much does ${rawKeyword} usually cost?`,
      answer: `Pricing for ${rawKeyword} varies depending on quality, features, and scale. Free or basic entry-level solutions start at $0, while professional or enterprise solutions range from $29 to $200+ per month or unit.`,
      category: 'Pricing',
    },
    {
      id: 'faq-3',
      question: `How do I select the best ${rawKeyword} for my needs?`,
      answer: `Start by identifying your primary goal, budget limit, and required features. Look for solutions with strong user reviews, verified ratings, robust support, and transparent policies in ${country}.`,
      category: 'Buying Guide',
    },
    {
      id: 'faq-4',
      question: `What are common mistakes to avoid with ${rawKeyword}?`,
      answer: `The most frequent pitfalls include skipping initial research, selecting over-complicated setups, neglecting ongoing maintenance, and failing to measure performance metrics regularly.`,
      category: 'Troubleshooting',
    },
    {
      id: 'faq-5',
      question: `Is ${rawKeyword} suitable for beginners?`,
      answer: `Yes! Most modern ${rawKeyword} frameworks and solutions are designed with user-friendly onboarding, tutorials, and guided workflows suitable for all experience levels.`,
      category: 'General',
    },
  ];

  // 8. FAQ JSON-LD Schema Markup
  const faqSchemaObj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const faqSchemaJsonLd = JSON.stringify(faqSchemaObj, null, 2);

  return {
    id: `seo-res-${Date.now()}`,
    timestamp: Date.now(),
    input: {
      keyword: rawKeyword,
      websiteUrl,
      country,
      language,
      intent,
      tone,
      brandName,
      contentType,
      domain: effectiveDomain,
    },
    generatedModule: actionType,
    overview: {
      keywordDifficulty: 'Medium Difficulty (KD 46/100)',
      difficultyScore: 46,
      searchIntent: `${intent} Intent`,
      recommendedContentLength: '2,000 - 2,600 words',
      contentStrategyTip: `To rank on Page 1 for "${rawKeyword}" in ${country} (${contentType}), structure your content with clean H2/H3 tags, include a comparison table, and embed the FAQ JSON-LD schema for rich search results.`,
      primaryCategory: 'Content & Search Strategy',
    },
    titles,
    metaDescriptions,
    urlSlugs,
    h1Headings,
    relatedKeywords,
    blogOutline,
    faqs,
    faqSchemaJsonLd,
  };
}
