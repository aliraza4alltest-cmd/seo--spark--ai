import { GoogleGenAI } from '@google/genai';
import { SeoGenerationRequest, SeoGenerationResult } from '../src/types/seo';
import { generateLocalSeoData } from '../src/utils/seoGenerator';

export async function handleSeoGeneration(reqBody: SeoGenerationRequest): Promise<SeoGenerationResult> {
  const {
    keyword,
    websiteUrl = '',
    country,
    language,
    intent,
    tone,
    brandName = '',
    contentType = 'Blog Post',
    domain = 'example.com',
    provider = 'auto',
    customApiKey = '',
    actionType = 'all',
  } = reqBody;

  if (!keyword || !keyword.trim()) {
    throw new Error('Keyword is required');
  }

  const groqApiKey = customApiKey && provider === 'groq' ? customApiKey : process.env.GROQ_API_KEY;
  const geminiApiKey = customApiKey && provider === 'gemini' ? customApiKey : process.env.GEMINI_API_KEY;

  const targetDomain = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').split('/')[0] : domain;

  const prompt = `
You are an expert SEO strategist and senior copywriter.
Generate a high-ranking SEO asset package for:
- Focus Keyword: "${keyword}"
- Website URL: "${websiteUrl || targetDomain}"
- Target Country: "${country}"
- Target Language: "${language}"
- Brand Name: "${brandName}"
- Content Type: "${contentType}"
- Search Intent: "${intent}"
- Tone of Voice: "${tone}"
- Target Action: "${actionType}"

Return ONLY valid minified JSON matching this exact structure:
{
  "overview": {
    "keywordDifficulty": "Medium (KD 45/100)",
    "difficultyScore": 45,
    "searchIntent": "${intent}",
    "recommendedContentLength": "2000 - 2500 words",
    "contentStrategyTip": "Actionable SEO tip tailored to this keyword and content type.",
    "primaryCategory": "Category Name"
  },
  "titles": [
    {
      "id": "t1",
      "title": "Optimized Title Tag (50-60 chars)",
      "characterCount": 55,
      "pixelWidthApprox": 500,
      "score": 95,
      "type": "CTR Hook",
      "powerWords": ["Best", "2026"],
      "analysis": "Short analysis of why this title ranks high."
    }
  ],
  "metaDescriptions": [
    {
      "id": "m1",
      "description": "Engaging Meta Description (145-160 chars) with strong CTA.",
      "characterCount": 152,
      "score": 96,
      "callToAction": "Click to learn more!",
      "analysis": "Explanation of CTR impact."
    }
  ],
  "urlSlugs": ["slug-1", "slug-2", "slug-3", "slug-4"],
  "h1Headings": ["H1 Headline 1", "H1 Headline 2", "H1 Headline 3", "H1 Headline 4", "H1 Headline 5"],
  "relatedKeywords": [
    {
      "id": "k1",
      "keyword": "related keyword",
      "type": "Primary",
      "searchVolume": "12,000/mo",
      "difficulty": 40,
      "intent": "${intent}"
    }
  ],
  "blogOutline": {
    "title": "Blog Outline Title",
    "estimatedWordCount": 2400,
    "targetAudience": "Target Reader Persona",
    "sections": [
      {
        "id": "s1",
        "heading": "H2 Heading",
        "level": "H2",
        "estimatedWords": 400,
        "keyPoints": ["Bullet 1", "Bullet 2"]
      }
    ]
  },
  "faqs": [
    {
      "id": "f1",
      "question": "Question 1?",
      "answer": "Answer 1",
      "category": "General"
    }
  ]
}
Ensure you generate 5 Title options, 3 Meta descriptions, 4 Slugs, 5 H1 headings, 7 Related keywords, 6 Content Outline sections, and 5 FAQs.
`;

  // Try Groq if requested or available
  if ((provider === 'groq' || provider === 'auto') && groqApiKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an AI SEO Generator that returns strictly valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const contentStr = groqData.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          return formatAiResult(parsed, reqBody);
        }
      }
    } catch (err) {
      console.warn('Groq API error, falling back to Gemini/Local:', err);
    }
  }

  // Try Gemini if available
  if ((provider === 'gemini' || provider === 'auto') && geminiApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (geminiRes.text) {
        const parsed = JSON.parse(geminiRes.text);
        return formatAiResult(parsed, reqBody);
      }
    } catch (err) {
      console.warn('Gemini API error, falling back to Local:', err);
    }
  }

  // Fallback to local algorithm engine
  return generateLocalSeoData(reqBody);
}

function formatAiResult(parsed: any, reqBody: SeoGenerationRequest): SeoGenerationResult {
  const localFallback = generateLocalSeoData(reqBody);

  const faqs = Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : localFallback.faqs;

  const faqSchemaObj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question || 'Question',
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || 'Answer',
      },
    })),
  };

  return {
    id: `seo-ai-${Date.now()}`,
    timestamp: Date.now(),
    input: {
      keyword: reqBody.keyword,
      websiteUrl: reqBody.websiteUrl,
      country: reqBody.country,
      language: reqBody.language,
      intent: reqBody.intent,
      tone: reqBody.tone,
      brandName: reqBody.brandName,
      contentType: reqBody.contentType,
      domain: reqBody.websiteUrl ? reqBody.websiteUrl.replace(/^https?:\/\//, '').split('/')[0] : reqBody.domain,
    },
    generatedModule: reqBody.actionType || 'all',
    overview: parsed.overview || localFallback.overview,
    titles: Array.isArray(parsed.titles) && parsed.titles.length > 0 ? parsed.titles : localFallback.titles,
    metaDescriptions: Array.isArray(parsed.metaDescriptions) && parsed.metaDescriptions.length > 0 ? parsed.metaDescriptions : localFallback.metaDescriptions,
    urlSlugs: Array.isArray(parsed.urlSlugs) && parsed.urlSlugs.length > 0 ? parsed.urlSlugs : localFallback.urlSlugs,
    h1Headings: Array.isArray(parsed.h1Headings) && parsed.h1Headings.length > 0 ? parsed.h1Headings : localFallback.h1Headings,
    relatedKeywords: Array.isArray(parsed.relatedKeywords) && parsed.relatedKeywords.length > 0 ? parsed.relatedKeywords : localFallback.relatedKeywords,
    blogOutline: parsed.blogOutline || localFallback.blogOutline,
    faqs: faqs,
    faqSchemaJsonLd: JSON.stringify(faqSchemaObj, null, 2),
  };
}
