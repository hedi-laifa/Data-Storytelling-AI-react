import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { datasetId } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: 'Hello! I am your AI Data Assistant. Ask me anything about your loaded dataset.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !datasetId) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/chat/ask', {
        dataset_id: datasetId,
        question: userMessage.content,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get a response from the AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!datasetId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Dataset Loaded</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Please upload a dataset first to start chatting with the AI about your data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dataset Assistant</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ask questions about your data</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'ai'
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {message.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 flex-row"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Bot size={18} />
              </div>
              <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm justify-center mx-auto w-max max-w-sm text-center">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about correlations, sums, missing values..."
            disabled={isLoading}
            className="flex-1 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-slate-100 dark:placeholder-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-3 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}