'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const languages = [
    { code: 'hi', name: 'हिंदी', native: 'Hindi', sub: 'नमस्ते' },
    { code: 'mr', name: 'मराठी', native: 'Marathi', sub: 'नमस्कार' },
    { code: 'en', name: 'English', native: 'English', sub: 'Hello' },
    { code: 'gu', name: 'ગુજરાતી', native: 'Gujarati', sub: 'નમસ્તે' },
];

export default function LanguageSelection() {
    const [selected, setSelected] = useState('en');
    const router = useRouter();

    const handleContinue = () => {
        // Save language preference here (e.g., localStorage)
        localStorage.setItem('language', selected);
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-slate-50 p-6 flex flex-col">
            <div className="mt-10 mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Select Language</h1>
                <p className="text-slate-500 font-medium">Choose your preferred language</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setSelected(lang.code)}
                        className={`
              relative p-6 rounded-3xl border-2 text-left transition-all duration-300
              ${selected === lang.code
                                ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200'
                                : 'bg-white border-white text-slate-600 shadow-sm hover:border-green-200'}
            `}
                    >
                        {selected === lang.code && (
                            <div className="absolute top-4 right-4 bg-white/20 p-1 rounded-full">
                                <Check size={14} className="text-white" strokeWidth={3} />
                            </div>
                        )}
                        <div className="text-2xl font-bold mb-1">{lang.name}</div>
                        <div className={`text-xs font-medium ${selected === lang.code ? 'text-green-100' : 'text-slate-400'}`}>
                            {lang.native}
                        </div>
                        <div className={`text-sm mt-4 font-medium ${selected === lang.code ? 'text-white' : 'text-slate-800'}`}>
                            {lang.sub}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex-1"></div>

            <button
                onClick={handleContinue}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-transform"
            >
                Continue
            </button>
        </main>
    );
}
