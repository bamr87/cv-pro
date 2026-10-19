export type AIProvider = 'grok' | 'openai' | 'affinda';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
}

// Providers report a bad key, an exhausted quota or a rejected request with an
// HTTP status and a JSON error body. Without this, a 401 fell through to
// "Invalid response from <provider>" (or, for Affinda, was handed on as if it
// were a parsed CV), so the one thing the user could actually fix was hidden.
async function assertOk(res: Response, provider: string): Promise<void> {
  if (res.ok) return;
  const body = await res.text().catch(() => '');
  const detail = errorDetail(body) ?? `${res.status} ${res.statusText}`;
  throw new Error(`${provider} rejected the request (HTTP ${res.status}): ${detail}`);
}

function errorDetail(body: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return body.slice(0, 200) || undefined;
  }
  if (typeof parsed !== 'object' || parsed === null) return body.slice(0, 200) || undefined;
  const record = parsed as Record<string, unknown>;
  // OpenAI/xAI: { error: { message } }; Affinda: { error } or { detail }.
  if (typeof record.error === 'object' && record.error !== null) {
    const message = (record.error as Record<string, unknown>).message;
    if (typeof message === 'string') return message;
  }
  for (const key of ['error', 'message', 'detail'] as const) {
    if (typeof record[key] === 'string') return record[key] as string;
  }
  return body.slice(0, 200) || undefined;
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
    await assertOk(res, 'xAI Grok');
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
    await assertOk(res, 'OpenAI');
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
    await assertOk(res, 'Affinda');
    const data = await res.json();
    // Convert Affinda structure to our expected JSON; for now return raw
    return JSON.stringify(data);
  }

  throw new Error('Unsupported AI provider');
}


