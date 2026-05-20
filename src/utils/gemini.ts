import { getPromptMock } from './promptLibrary';
import type { GenerationMode } from '../types/workspace';

export type GenerateResult =
  | { type: 'code'; content: string }
  | { type: 'explanation'; content: string };

const modeLabels: Record<GenerationMode, string> = {
  build: 'Building a new app...',
  refine: 'Preparing current app for refinement...',
  fix: 'Inspecting current app for targeted fixes...',
  explain: 'Reading current app for explanation...',
};

export const generateCode = async (
  promptText: string,
  onStepChange: (step: number, status: string) => void,
  previousCode?: string,
  mode: GenerationMode = previousCode?.trim() ? 'refine' : 'build'
): Promise<GenerateResult> => {
  const apiKey = localStorage.getItem('vibecraft_api_key') || '';
  const modelName = localStorage.getItem('vibecraft_model') || 'gemini-2.5-flash';
  const hasExistingCode = Boolean(previousCode?.trim());

  // Helper to sleep for simulation delays
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- MOCK MODE (OFFLINE) ---
  if (!apiKey) {
    if (mode === 'explain') {
      onStepChange(0, 'Reading local HTML...');
      await sleep(400);
      onStepChange(1, 'Summarizing visible structure...');
      await sleep(500);
      onStepChange(4, 'Explanation ready.');

      return {
        type: 'explanation',
        content: hasExistingCode
          ? 'Demo Offline Mode explanation: this is a standalone HTML app rendered in the sandbox preview. It contains its own markup, styles, and browser-side JavaScript. Add a Gemini API key to get a deeper code-level explanation.'
          : 'There is no generated app to explain yet. Build or load a starter template first.',
      };
    }

    if (mode !== 'build') {
      throw new Error(`${mode === 'fix' ? 'Fixing' : 'Refining'} an existing app requires Gemini API access. Demo mode can load starter templates only.`);
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
    return { type: 'code', content: getPromptMock(promptText) };
  }

  // --- AI MODE (ONLINE) ---
  try {
    onStepChange(0, 'Connecting to Gemini API...');
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    await sleep(500);

    if ((mode === 'refine' || mode === 'fix' || mode === 'explain') && !hasExistingCode) {
      throw new Error(`${mode[0].toUpperCase()}${mode.slice(1)} mode needs an existing app first.`);
    }

    onStepChange(1, modeLabels[mode]);
    
    const codeSystemPrompt = `You are a world-class frontend web developer.
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

    const explainSystemPrompt = `You are a concise frontend code reviewer.
Explain the provided single-file HTML app in clear, practical language.
Do not rewrite the code. Do not output HTML. If the user asks for changes, explain what would need to change instead of modifying it.`;

    const userPromptByMode: Record<GenerationMode, string> = {
      build: `Build a new standalone single-file app from this request:\n${promptText}`,
      refine: `Update this existing single-file app according to the request while preserving working features that were not mentioned.\n\nRequest:\n${promptText}\n\nExisting HTML:\n${previousCode}`,
      fix: `Fix the smallest necessary issue in this existing single-file app. Preserve behavior that is unrelated to the user's bug report. Return the corrected complete HTML.\n\nBug report or fix request:\n${promptText}\n\nExisting HTML:\n${previousCode}`,
      explain: `User question:\n${promptText}\n\nExisting HTML:\n${previousCode}`,
    };

    onStepChange(2, mode === 'explain' ? 'Preparing explanation...' : mode === 'fix' ? 'Applying targeted correction...' : 'Generating premium CSS styling...');
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPromptByMode[mode],
      config: {
        systemInstruction: mode === 'explain' ? explainSystemPrompt : codeSystemPrompt,
        temperature: 0.2,
      }
    });

    onStepChange(3, mode === 'explain' ? 'Writing explanation...' : 'Compiling interactive JavaScript logic...');
    await sleep(800);

    if (mode === 'explain') {
      onStepChange(4, 'Explanation ready!');
      return {
        type: 'explanation',
        content: response.text?.trim() || 'No explanation was returned.',
      };
    }

    const code = normalizeGeneratedHtml(response.text || '');

    onStepChange(4, 'Compilation complete!');
    return { type: 'code', content: code };
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
