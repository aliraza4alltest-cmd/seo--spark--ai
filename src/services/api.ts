import { SeoGenerationRequest, SeoGenerationResult } from '../types/seo';
import { generateLocalSeoData } from '../utils/seoGenerator';

export async function fetchServerConfig(): Promise<{ hasGroqKey: boolean; hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Unable to fetch /api/config, assuming default local setup:', err);
  }
  return { hasGroqKey: false, hasGeminiKey: false };
}

export async function generateSeoData(
  request: SeoGenerationRequest
): Promise<SeoGenerationResult> {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.warn('Server API error, falling back to local generator engine');
    }
  } catch (err) {
    console.warn('Network or server unreachable, using high-speed local engine:', err);
  }

  // Instant client-side fallback if server API is unavailable
  return generateLocalSeoData(request);
}
