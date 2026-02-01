'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, Leaf, Globe, Settings, Lock } from 'lucide-react';

export default function AssistantLink() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Namaste! I am GramAI. How can I assist you with farming today?', type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [permissionState, setPermissionState] = useState('prompt'); // prompt, granted, denied
    const [language, setLanguage] = useState('hi-IN'); // Default Hindi

    const recognitionRef = useRef(null);
    const isRecognitionActive = useRef(false);

    useEffect(() => {
        // 1. Proactive Permission Check
        if (typeof navigator !== 'undefined' && navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
                setPermissionState(permissionStatus.state);

                permissionStatus.onchange = () => {
                    setPermissionState(permissionStatus.state);
                };
            }).catch(() => {
                // Fallback for browsers not supporting microphone permission query
                console.log("Permission API not supported for microphone checking.");
            });
        }

        // 2. Initialize Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();

                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = language;

                recognition.onstart = () => {
                    isRecognitionActive.current = true;
                    setIsListening(true);
                };

                recognition.onend = () => {
                    isRecognitionActive.current = false;
                    setIsListening(false);
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) {
                        setInput(prev => prev ? prev + ' ' + transcript : transcript);
                    }
                };

                recognition.onerror = (event) => {
                    console.warn("Speech recognition error", event.error);
                    isRecognitionActive.current = false;
                    setIsListening(false);

                    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                        setPermissionState('denied');
                    }
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    // Sync language changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported. Use Chrome/Edge/Brave.");
            return;
        }

        if (permissionState === 'denied') {
            // Don't start if blocked
            return;
        }

        if (isRecognitionActive.current) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Failed to start speech recognition:", e);
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add User Message
        const newMessages = [...messages, { role: 'user', text: input, type: 'text' }];
        setMessages(newMessages);
        setInput('');

        // Call Real Backend API
        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'user_123', // Hardcoded for demo
                    text: input,
                    language: language
                })
            });

            const data = await response.json();

            if (data.answer) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    text: data.answer,
                    type: 'response',
                }]);
            } else {
                // Fallback if API fails (e.g. no keys)
                setMessages(prev => [...prev, {
                    role: 'ai',
                    text: 'Backend is ready! Please configure your API keys in .env.local to get real AI responses.',
                    type: 'response',
                    action: 'Check Setup'
                }]);
            }
        } catch (error) {
            console.error("API Error:", error);

            let errorMessage = 'Connection error. Please check your internet.';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Server unreachable. Ensure you are on the same Wi-Fi as the PC.';
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                text: errorMessage,
                type: 'response',
                action: 'Retry'
            }]);
        }
    };

    const handleAction = (action) => {
        if (action === 'Retry') {
            handleSend();
        } else if (action === 'Check Setup') {
            // In a real app, this could open a modal
            alert('Check .env.local on your PC.');
        }
    };

    return (
        <main className="flex-col" style={{ height: '100vh', paddingBottom: '80px', background: '#F5F5F5' }}>
            <div className="header" style={{ position: 'fixed', top: 0, width: '100%', maxWidth: '480px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="text-green">AI Assistant</h2>
                        <p>Voice & Text Support</p>
                    </div>

                    <button
                        onClick={() => setLanguage(prev => prev === 'hi-IN' ? 'mr-IN' : 'hi-IN')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid #E0E0E0',
                            background: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <Globe size={14} color="#555" />
                        {language === 'hi-IN' ? 'Hindi' : 'Marathi'}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '100px 20px 20px 20px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            maxWidth: '80%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            background: msg.role === 'user' ? '#2E7D32' : 'white',
                            color: msg.role === 'user' ? 'white' : '#212121',
                            boxShadow: msg.role === 'ai' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                {msg.role === 'ai' && <Bot size={16} color="#2E7D32" />}
                                <span style={{ fontSize: '12px', opacity: 0.8 }}>{msg.role === 'user' ? 'You' : 'GramAI'}</span>
                            </div>
                            <p style={{ marginBottom: msg.action ? '8px' : '0', color: 'inherit' }}>{msg.text}</p>
                            {msg.action && (
                                <button
                                    className="btn"
                                    onClick={() => handleAction(msg.action)}
                                    style={{ background: '#E8F5E9', color: '#2E7D32', padding: '8px', fontSize: '13px', height: 'auto', cursor: 'pointer' }}
                                >
                                    <Leaf size={14} /> {msg.action}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Denied Alert Card */}
            {permissionState === 'denied' && (
                <div style={{
                    position: 'fixed',
                    bottom: '150px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '430px',
                    background: '#FFEBEE',
                    border: '1px solid #FFCDD2',
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)',
                    zIndex: 200
                }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#C62828' }}>
                        <Lock size={18} />
                        <span style={{ fontWeight: '600' }}>Microphone Blocked</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#D32F2F', paddingLeft: '28px' }}>
                        1. Click site settings / lock icon in address bar.<br />
                        2. Set <strong>Microphone</strong> to <strong>Allow</strong>.<br />
                        3. Refresh the page.
                    </div>
                </div>
            )}

            <div style={{
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                padding: '16px',
                background: 'white',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
            }}>
                <button
                    onClick={toggleListening}
                    disabled={permissionState === 'denied' || isListening}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                        background: permissionState === 'denied' ? '#E0E0E0' : isListening ? '#FFEBEE' : '#E0E0E0',
                        color: permissionState === 'denied' ? '#9E9E9E' : isListening ? '#D32F2F' : '#757575',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        cursor: permissionState === 'denied' ? 'not-allowed' : isListening ? 'default' : 'pointer',
                        animation: isListening ? 'pulse 1.5s infinite' : 'none',
                        border: isListening ? '1px solid #D32F2F' : 'none'
                    }}>
                    <Mic size={20} />
                </button>
                <style jsx>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); }
            100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
          }
        `}</style>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask in Hindi or Marathi..."}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '24px',
                        border: isListening ? '1px solid #D32F2F' : permissionState === 'denied' ? '1px solid #EF9A9A' : '1px solid #E0E0E0',
                        outline: 'none',
                        background: isListening ? '#FFF9F9' : 'white'
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#2E7D32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Send size={18} />
                </button>
            </div>
        </main>
    );
}
