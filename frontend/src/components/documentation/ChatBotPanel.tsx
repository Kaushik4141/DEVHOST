"use client";

import { useState } from 'react';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';
import { Input } from '@/components/documentation/ui/input';
import { Button } from '@/components/documentation/ui/button';
import { ScrollArea } from '@/components/documentation/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatBotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBotPanel({ isOpen, onClose }: ChatBotPanelProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI documentation assistant powered by RAG technology. I can help you with:\n\n• Finding specific information about Lernflow\n• Explaining concepts and features\n• Answering questions about the codebase\n• Providing guidance on implementation details",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Call the ngrok API endpoint
      const response = await fetch('https://geminately-coarse-yoshiko.ngrok-free.dev/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Remove loading message and add bot response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const botResponse: Message = {
          id: Date.now().toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        return [...withoutLoading, botResponse];
      });
    } catch (error) {
      console.error('Error fetching bot response:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const errorResponse: Message = {
          id: Date.now().toString(),
          content: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        };
        return [...withoutLoading, errorResponse];
      });
    } finally {
      setIsSending(false);
    }
  };

  // Using the API endpoint instead of local responses

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "tween", 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#000000] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                  <p className="text-xs text-slate-400">How can I help you today?</p>
                </motion.div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Close chat"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                      layout
                    >
                      {!msg.isUser && (
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {msg.isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Bot className="w-4 h-4 text-white" />
                            </motion.div>
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </motion.div>
                      )}
                      
                      <motion.div 
                        className={`max-w-[80%] ${
                          msg.isUser 
                            ? 'bg-cyan-500/10 border border-cyan-500/20' 
                            : 'bg-white/5 border border-white/10'
                        } rounded-lg p-4`}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {msg.isLoading ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            />
                            <span className="text-slate-400 text-sm">Thinking...</span>
                          </div>
                        ) : (
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        )}
                      </motion.div>

                      {msg.isUser && (
                        <motion.div 
                          className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <User className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            {/* Input Area */}
            <motion.div 
              className="p-4 border-t border-white/10 bg-gradient-to-t from-black/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <motion.div
                  className="flex-1"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Input
                    type="text"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                    className="w-full bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: isSending ? 1 : 1.05 }}
                  whileTap={{ scale: isSending ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isSending}
                    className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Add the missing useRef import
import { useRef, useEffect } from 'react';