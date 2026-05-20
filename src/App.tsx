import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import type { ChatMessage } from './components/ChatArea';
import { PreviewArea } from './components/PreviewArea';
import { SettingsModal } from './components/SettingsModal';
import { generateCode } from './utils/gemini';
import type { PromptItem } from './utils/promptLibrary';

const initialMessages: ChatMessage[] = [
  {
    id: 'greet',
    sender: 'ai',
    text: 'VibeCraft AI Ready. Select a starter template from the sidebar or describe your application prompt to generate a single-file interactive layout.'
  }
];

interface StoredWorkspace {
  currentCategory: string;
  messages: ChatMessage[];
  generatedCode: string;
}

const WORKSPACE_STORAGE_KEY = 'vibecraft_workspace_v1';

const readStoredWorkspace = (): StoredWorkspace | null => {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredWorkspace>;
    if (!Array.isArray(parsed.messages)) return null;

    return {
      currentCategory: parsed.currentCategory || 'portfolios',
      messages: parsed.messages,
      generatedCode: parsed.generatedCode || '',
    };
  } catch {
    return null;
  }
};

function App() {
  const [currentCategory, setCurrentCategory] = useState(() => readStoredWorkspace()?.currentCategory || 'portfolios');
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredWorkspace()?.messages || initialMessages);
  const [generatedCode, setGeneratedCode] = useState<string>(() => readStoredWorkspace()?.generatedCode || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stepStatusText, setStepStatusText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => Boolean(localStorage.getItem('vibecraft_api_key')));

  const createId = () => crypto.randomUUID();

  useEffect(() => {
    const workspace: StoredWorkspace = {
      currentCategory,
      messages,
      generatedCode,
    };

    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
  }, [currentCategory, generatedCode, messages]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    setErrorMsg(null);
    setInputVal('');
    
    // Add user prompt to logs
    const userMsgId = createId();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: promptText }
    ]);

    setIsGenerating(true);
    setActiveStep(0);
    setStepStatusText(generatedCode ? 'Preparing current app for refinement...' : 'Initializing...');

    try {
      const previousCode = generatedCode.trim() ? generatedCode : undefined;
      const isOnlineGeneration = Boolean(localStorage.getItem('vibecraft_api_key'));
      const code = await generateCode(promptText, (step, status) => {
        setActiveStep(step);
        setStepStatusText(status);
      }, previousCode);
      
      setGeneratedCode(code);
      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          sender: 'ai',
          text: previousCode
            ? 'Updated your application. The preview and code view now reflect the requested change.'
            : isOnlineGeneration
              ? 'Successfully generated your application! Click "Live Preview" or "Code View" on the right to examine it.'
              : 'Loaded a matching offline demo template. Add a Gemini API key in Settings to generate custom apps from scratch.',
        }
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
      setErrorMsg(message);
      setMessages(prev => [
        ...prev,
        { id: createId(), sender: 'ai', text: 'Oops! An error occurred during the compilation step. Review the details below.' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPrompt = (prompt: PromptItem) => {
    setInputVal(prompt.prompt);
    handleSendPrompt(prompt.prompt);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'new-greet',
        sender: 'ai',
        text: 'New workspace opened. Select a starter template from the sidebar or write a custom layout description.'
      }
    ]);
    setGeneratedCode('');
    setInputVal('');
    setErrorMsg(null);
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        onSelectPrompt={handleSelectPrompt}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewChat={handleNewChat}
        hasApiKey={hasApiKey}
      />

      {/* Central chat interface */}
      <ChatArea
        messages={messages}
        isGenerating={isGenerating}
        activeStep={activeStep}
        stepStatusText={stepStatusText}
        errorMsg={errorMsg}
        onSendPrompt={handleSendPrompt}
        inputVal={inputVal}
        setInputVal={setInputVal}
        hasGeneratedCode={Boolean(generatedCode)}
      />

      {/* Right side live sandboxed preview */}
      <PreviewArea code={generatedCode} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigurationChange={() => setHasApiKey(Boolean(localStorage.getItem('vibecraft_api_key')))}
      />
    </div>
  );
}

export default App;
