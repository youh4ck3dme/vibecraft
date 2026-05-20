import { getPromptMock } from './promptLibrary';

export const generateCode = async (
  promptText: string,
  onStepChange: (step: number, status: string) => void,
  previousCode?: string
): Promise<string> => {
  const apiKey = localStorage.getItem('vibecraft_api_key') || '';
  const modelName = localStorage.getItem('vibecraft_model') || 'gemini-2.5-flash';
  const isRefinement = Boolean(previousCode?.trim());

  // Helper to sleep for simulation delays
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- MOCK MODE (OFFLINE) ---
  if (!apiKey) {
    if (isRefinement) {
      throw new Error('Refining an existing app requires Gemini API access. Demo mode can load starter templates only.');
    }

    onStepChange(0, 'Analyzing project requirements...');
    await sleep(1000);
    
    onStepChange(1, 'Creating responsive structure...');
    await sleep(1000);
    
    onStepChange(2, 'Adding custom design and styles...');
    await sleep(1200);
    
    onStepChange(3, 'Injecting interactive components...');
    await sleep(1000);

    onStepChange(4, 'Complete!');
    return getPromptMock(promptText);
  }

  // --- AI MODE (ONLINE) ---
  try {
    onStepChange(0, 'Connecting to Gemini API...');
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    await sleep(500);

    onStepChange(1, isRefinement ? 'Reading current app structure...' : 'Synthesizing web application structure...');
    
    const systemPrompt = `You are a world-class frontend web developer. 
Your task is to build a single-file, highly functional, and visually stunning web page/application based on the user's prompt.

Follow these strict design guidelines:
1. Use rich modern aesthetics: Sleek dark theme, subtle gradients, and glassmorphic cards (semi-transparent backgrounds with backdrop-filter: blur).
2. Utilize premium typography (import modern sans-serif fonts from Google Fonts like 'Outfit', 'Plus Jakarta Sans', or 'Inter').
3. Ensure the design is fully responsive and mobile-friendly.
4. Include rich interactions (hover states, animations, transitions, and click behaviors).
5. All code must be self-contained in a SINGLE file. Put all CSS inside a <style> block and all JS logic inside a <script> block.
6. NO PLACEHOLDERS. Make the application fully complete, with real mockup data, functional calculations, or playable game mechanics.
7. If existing HTML is provided, modify it directly according to the user's change request while preserving working features that were not mentioned.

Do not write any chat explanations before or after.
Output ONLY the raw HTML code. Do NOT wrap the code in markdown code blocks like \`\`\`html or \`\`\`. Just start the response with <!DOCTYPE html>.`;

    const userPrompt = isRefinement
      ? `Update this existing single-file app according to the request.\n\nRequest:\n${promptText}\n\nExisting HTML:\n${previousCode}`
      : `Build: ${promptText}`;

    onStepChange(2, 'Generating premium CSS styling...');
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      }
    });

    onStepChange(3, 'Compiling interactive JavaScript logic...');
    await sleep(800);

    const code = normalizeGeneratedHtml(response.text || '');

    onStepChange(4, 'Compilation complete!');
    return code;
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    onStepChange(4, 'Generation failed.');
    const message = error instanceof Error ? error.message : 'Failed to generate code via Gemini API.';
    throw new Error(message, { cause: error });
  }
};

const normalizeGeneratedHtml = (rawCode: string): string => {
  let code = rawCode.trim();

  const fencedMatch = code.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    code = fencedMatch[1].trim();
  }

  const htmlStart = code.search(/<!doctype html>|<html[\s>]/i);
  if (htmlStart > 0) {
    code = code.slice(htmlStart).trim();
  }

  if (!/<html[\s>]/i.test(code)) {
    code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeCraft Generated App</title>
</head>
<body>
${code}
</body>
</html>`;
  }

  return code;
};
