import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  RotateCcw,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface SocraticAITutorProps {
  initialContext?: string;
  initialPrompt?: string;
  missionData?: any;
}

export const SocraticAITutor: React.FC<SocraticAITutorProps> = ({
  initialContext,
  initialPrompt,
  missionData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      content:
        'Halo! Saya Dr. Bio, AI Socratic Biology Tutor-mu di BioLab AI 3D. Saya siap membimbingmu menjelajahi sistem peredaran darah manusia. Ingat, saya tidak akan langsung memberikan jawaban instan, tetapi kita akan bersama-sama menelusuri bukti ilmiah dari model 3D dan data pasien. Apa fenomena atau struktur yang ingin kamu selidiki sekarang?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentContext, setCurrentContext] = useState<string>(initialContext || 'Eksplorasi Jantung dan Sirkulasi Darah');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial prompt from Hotspots or Missions
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt, initialContext);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string, contextOverride?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyToSend = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/socratic-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: historyToSend,
          currentContext: contextOverride || currentContext,
          missionData: missionData || {},
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'Mari kita perhatikan kembali data pada model 3D untuk menemukan petunjuknya.';

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error('Error contacting Socratic Tutor API:', error);
      const fallbackMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content:
          'Pengamatanmu sangat menarik! Untuk membuktikannya, coba amati kembali: Apakah tekanan hidrostatik di aorta lebih tinggi dibanding di arteri pulmonalis, dan bagaimana hal tersebut menuntut adaptasi ketebalan miokardium?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Mengapa ventrikel kiri jauh lebih tebal daripada ventrikel kanan?',
    'Apa hubungan suara murmur sistolik dengan stenosis katup aorta?',
    'Bagaimana korda tendinea dan katup mitral mencegah aliran balik darah?',
    'Mengapa sirkulasi pulmonal membutuhkan tekanan yang jauh lebih rendah daripada sirkulasi sistemik?',
  ];

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content:
          'Sesi dialog di-reset. Silakan ajukan pertanyaan atau hipotesis barumu mengenai anatomi jantung, data pasien, atau sirkulasi darah!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4">
      {/* Header & Persona Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Dr. Bio — AI Socratic Biology Tutor</h2>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Membimbing siswa kelas XI berpikir kritis melalui pertanyaan reflektif bertahap, bukan memberikan contekan instan.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Mulai Sesi Dialog Baru"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sesi</span>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-4 overflow-y-auto flex flex-col gap-3 min-h-[420px] max-h-[560px]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[9px] mt-1.5 font-mono text-right ${
                    isUser ? 'text-cyan-200' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl rounded-tl-none border border-slate-800 text-xs text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Dr. Bio sedang menelaah penalaranmu...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="mt-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Pemantik Diskusi Berpikir Kritis Cepat:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tuliskan hipotesis, bukti observasi, atau pertanyaan ilmumu kepada Dr. Bio..."
          disabled={isLoading}
          className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-colors shadow flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Ethical Safety Notice */}
      <div className="mt-2 text-center text-[10px] text-slate-500">
        AI Tutor ini berpedoman pada kurikulum Biologi SMA untuk melatih nalar kritis dan tidak digunakan sebagai diagnosis medis klinis nyata.
      </div>
    </div>
  );
};
