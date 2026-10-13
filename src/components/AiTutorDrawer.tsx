import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircleQuestion, Bot, User, RefreshCw } from 'lucide-react';
import { askAiTutor } from '../services/geminiService';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextTitle?: string;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({ isOpen, onClose, contextTitle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Halo! Saya Tutor Pintar Cakrawala. ${
        contextTitle ? `Saat ini kita sedang membahas "${contextTitle}".` : 'Ada konsep sains, rumus matematika, atau logika coding yang ingin kamu pahami lebih dalam hari ini?'
      }`,
      time: 'Baru saja'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Jelaskan prinsip Efek Bohr dalam 3 poin sederhana',
    'Mengapa sudut 45° menghasilkan jarak peluru terjauh?',
    'Bagaimana cara kerja rekonsiliasi Virtual DOM React?',
    'Buatkan 2 kuis latihan konsep turunan dan garis singgung'
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputQuestion;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askAiTutor(textToSend, contextTitle, messages);
      const aiMsg: Message = {
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        sender: 'ai',
        text: 'Maaf, terjadi gangguan saat menghubungkan ke server tutor. Silakan coba kembali sesaat lagi.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 text-white w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Tutor Pintar Cakrawala
                <span className="text-[10px] text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded border border-sky-800/60 font-mono">
                  AI Mentor
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {contextTitle ? `Konteks: ${contextTitle}` : 'Panduan Belajar Interaktif'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md whitespace-nowrap border border-slate-700 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-line shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-xs'
                    : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700/80'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Tutor sedang menganalisis materi dan menyusun penjelasan...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tanyakan konsep, rumus, atau solusi soal..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuestion.trim()}
              className="p-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
