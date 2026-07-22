import React, { useState } from 'react';
import { aiAPI } from '../../services/api';
import { Sparkles, Send, Bot, User as UserIcon, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  projectId?: number;
}

const SUGGESTED_PROMPTS = [
  "How can I reduce project cost?",
  "Which cement brand is better?",
  "Can I reduce steel usage?",
  "What materials are increasing in price?",
  "How much extra budget should I keep?",
  "Suggest better material alternatives.",
  "Estimate construction duration."
];

export const AIChatInterface: React.FC<Props> = ({ projectId }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; explanation?: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am ConstructAI Copilot. Ask me any question about cost reduction, brand alternatives, steel rebar optimization, or site schedule planning.",
      explanation: "Powered by ConstructAI civil engineering rules engine and regional spot price index."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: promptText }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat(promptText, projectId);
      setMessages([
        ...newMsgs,
        { role: 'assistant', text: res.reply, explanation: res.explanation }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">ConstructAI Copilot Assistant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Civil engineering decision support & procurement advisor</p>
          </div>
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-medium border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-xl space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-br-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.explanation && (
                <div className="text-[10px] text-slate-400 font-mono italic px-2 py-1 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 flex items-center gap-1.5 mt-1.5 w-fit">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Explanation: {msg.explanation}</span>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-slate-400 italic">ConstructAI Copilot is analyzing project parameters...</div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask any construction, material, or budget question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
