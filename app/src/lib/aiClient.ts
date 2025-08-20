export type AIProvider = 'grok' | 'openai' | 'affinda';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
}

export async function parseCvText(settings: AISettings, text: string): Promise<string> {
  // Returns raw JSON string from provider
  const systemPrompt = `Extract CV/resume information from the following text and return it as a structured JSON object with keys: personalInfo, experience[], education[], projects[], skills[], certifications[], languages[]. Use YYYY-MM for dates.`;

  if (settings.provider === 'grok') {
    // xAI Grok API
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      }),
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Invalid response from Grok');
    return content;
  }

  if (settings.provider === 'openai') {
    // OpenAI
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      }),
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Invalid response from OpenAI');
    return content;
  }

  if (settings.provider === 'affinda') {
    // Affinda resume parsing API (simplified text endpoint)
    const res = await fetch('https://api.affinda.com/v3/documents:parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({ data: text, extractor: 'resume' }),
    });
    const data = await res.json();
    // Convert Affinda structure to our expected JSON; for now return raw
    return JSON.stringify(data);
  }

  throw new Error('Unsupported AI provider');
}


