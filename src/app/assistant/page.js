'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, User, Globe, Loader2, Sparkles, Volume2 } from 'lucide-react';

export default function AssistantLink() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'राम राम! मी तुमचा कृषी मित्र आहे. शेतीबद्दल काहीही विचारा.', type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('hi-IN'); // Default Hindi
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = language;

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) setInput(prev => prev + ' ' + transcript);
                };

                recognitionRef.current = recognition;
            }
        }
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Please use Chrome or Edge for Voice features.");
            return;
        }
        if (isListening) recognitionRef.current.stop();
        else recognitionRef.current.start();
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'demo_user', text: input, language })
            });

            const data = await res.json();

            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.answer || "Sorry, I couldn't understand that."
            }]);

            // Basic Text-to-Speech (Browser Native)
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(data.answer);
                utterance.lang = language;
                window.speechSynthesis.speak(utterance);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: "Connection Error. Please check your internet." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col mobile-container relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
                        Gram Guru
                    </h1>
                    <p className="text-xs text-slate-500">AI Agriculture Expert</p>
                </div>
                <button
                    onClick={() => setLanguage(l => {
                        if (l === 'hi-IN') return 'mr-IN';
                        if (l === 'mr-IN') return 'hi-en';
                        return 'hi-IN';
                    })}
                    className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 border border-slate-200 active:scale-95 transition-transform"
                >
                    <Globe size={14} />
                    {language === 'hi-IN' ? 'Hindi' : (language === 'mr-IN' ? 'Marathi' : 'Hinglish')}
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                            ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-br-none'
                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}
                        `}>
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                <span className="text-xs font-bold uppercase">{msg.role === 'user' ? 'You' : 'Guru'}</span>
                            </div>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin text-green-600" />
                            <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur-md p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 bg-slate-100 p-2 pr-2 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-green-500/20 transition-all shadow-inner">
                    <button
                        onClick={toggleListening}
                        className={`
                            h-12 w-12 rounded-full flex items-center justify-center transition-all
                            ${isListening
                                ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50'
                                : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm'}
                        `}
                    >
                        <Mic size={22} className={isListening ? 'animate-bounce' : ''} />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Ask your question..."}
                        className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="h-10 w-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none active:scale-90 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                    Powered by OpenAI & Rural Intelligence
                </p>
            </div>

        </main>
    );
}
