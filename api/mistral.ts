import type { IncomingMessage, ServerResponse } from 'node:http';

type MistralProxyRequest = {
  systemPrompt?: unknown;
  userPrompt?: unknown;
  model?: unknown;
};

type MistralResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const MAX_PROMPT_CHARS = 650_000;
const DEFAULT_MODEL = 'mistral-large-latest';

const readJsonBody = async (req: IncomingMessage): Promise<MistralProxyRequest> => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as MistralProxyRequest;
};

const writeJson = (
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>
) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

const getMistralKeys = (): string[] => [
  process.env.MISTRAL_API_KEY_1?.trim(),
  process.env.MISTRAL_API_KEY_2?.trim(),
].filter((key): key is string => Boolean(key));

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    writeJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const keys = getMistralKeys();
  if (keys.length === 0) {
    writeJson(res, 503, { error: 'Mistral server keys are not configured.' });
    return;
  }

  let body: MistralProxyRequest;
  try {
    body = await readJsonBody(req);
  } catch {
    writeJson(res, 400, { error: 'Invalid JSON body.' });
    return;
  }

  const systemPrompt = typeof body.systemPrompt === 'string' ? body.systemPrompt : '';
  const userPrompt = typeof body.userPrompt === 'string' ? body.userPrompt : '';
  const model = typeof body.model === 'string' && body.model.trim()
    ? body.model.trim()
    : process.env.MISTRAL_MODEL?.trim() || DEFAULT_MODEL;

  if (!systemPrompt.trim() || !userPrompt.trim()) {
    writeJson(res, 400, { error: 'systemPrompt and userPrompt are required.' });
    return;
  }

  if (systemPrompt.length + userPrompt.length > MAX_PROMPT_CHARS) {
    writeJson(res, 413, { error: 'Prompt payload is too large.' });
    return;
  }

  let lastStatus = 502;

  for (let index = 0; index < keys.length; index += 1) {
    try {
      const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keys[index]}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      lastStatus = mistralResponse.status;

      if (!mistralResponse.ok) {
        continue;
      }

      const data = await mistralResponse.json() as MistralResponse;
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        writeJson(res, 200, {
          content,
          provider: 'mistral',
          model,
          keySlot: index + 1,
        });
        return;
      }
    } catch {
      lastStatus = 502;
    }
  }

  writeJson(res, 502, {
    error: 'Mistral request failed using configured server keys.',
    status: lastStatus,
  });
}
