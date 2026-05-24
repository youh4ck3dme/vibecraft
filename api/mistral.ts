declare const process: {
  env: Record<string, string | undefined>;
};

type NodeLikeRequest = AsyncIterable<string | { toString(): string }> & {
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
};

type NodeLikeResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

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

const ALLOWED_MODELS = [
  'mistral-large-latest',
  'mistral-medium-latest',
  'codestral-latest',
] as const;
const MAX_PROMPT_CHARS = 120_000;
const DEFAULT_MODEL = 'mistral-large-latest';
const PRODUCTION_ORIGIN = 'https://vibecraft.rubberduck.sk';

const readJsonBody = async (req: NodeLikeRequest): Promise<MistralProxyRequest> => {
  let rawBody = '';

  for await (const chunk of req) {
    rawBody += typeof chunk === 'string' ? chunk : chunk.toString();
  }

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody) as MistralProxyRequest;
};

const writeJson = (
  res: NodeLikeResponse,
  statusCode: number,
  payload: Record<string, unknown>
) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.end(JSON.stringify(payload));
};

const getMistralKeys = (): string[] => [
  process.env.MISTRAL_API_KEY_1?.trim(),
  process.env.MISTRAL_API_KEY_2?.trim(),
].filter((key): key is string => Boolean(key));

const getAllowedOrigins = (): Set<string> => {
  const origins = [PRODUCTION_ORIGIN];
  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    origins.push(`https://${vercelUrl}`);
  }

  return new Set(origins);
};

const getHeader = (req: NodeLikeRequest, name: string): string => {
  const value = req.headers?.[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
};

const getRequestOrigin = (req: NodeLikeRequest): string => {
  const origin = getHeader(req, 'origin');
  if (origin) {
    return origin;
  }

  const referer = getHeader(req, 'referer');
  if (!referer) {
    return '';
  }

  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
};

const isAllowedOrigin = (origin: string): boolean => {
  return getAllowedOrigins().has(origin);
};

const isJsonRequest = (req: NodeLikeRequest): boolean => {
  const contentType = getHeader(req, 'content-type');
  return contentType.toLowerCase().split(';')[0].trim() === 'application/json';
};

const isAllowedModel = (model: string): model is typeof ALLOWED_MODELS[number] =>
  ALLOWED_MODELS.includes(model as typeof ALLOWED_MODELS[number]);

export default async function handler(req: NodeLikeRequest, res: NodeLikeResponse) {
  const requestOrigin = getRequestOrigin(req);
  const allowedOrigin = isAllowedOrigin(requestOrigin);

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Allow', 'POST, OPTIONS');

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = allowedOrigin ? 204 : 403;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    writeJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!allowedOrigin) {
    writeJson(res, 403, { error: 'Origin is not allowed.' });
    return;
  }

  if (!isJsonRequest(req)) {
    writeJson(res, 415, { error: 'Content-Type must be application/json.' });
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

  if (!isAllowedModel(model)) {
    writeJson(res, 400, { error: 'Unsupported model.' });
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
