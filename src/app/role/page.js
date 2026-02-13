'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tractor, Store, Shovel, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
    {
        id: 'farmer',
        title: 'Farmer (Kisan)',
        desc: 'Get crop advice, market rates & hire labor.',
        icon: <Tractor size={32} />,
        color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
        id: 'shop_owner',
        title: 'Shop Owner (Dukandaar)',
        desc: 'List your fertilizers, seeds & tools for sale.',
        icon: <Store size={32} />,
        color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
        id: 'worker',
        title: 'Agri-Worker (Majdoor)',
        desc: 'Find daily wage farm jobs near you.',
        icon: <Shovel size={32} />,
        color: 'bg-orange-100 text-orange-600 border-orange-200'
    }
];

export default function RoleSelection() {
    const [selected, setSelected] = useState('farmer'); // Default
    const router = useRouter();

    const handleContinue = () => {
        localStorage.setItem('role', selected);
        // After role, go to Onboarding flow or Home if already onboarded
        // ensuring we follow the flow: Role -> Onboarding -> Language -> Home
        // But since we are injecting this into existing flow:
        // User lands here after Language (or we inject before). 
        // Let's assume: Login -> Role -> Onboarding...
        // For now, let's go to Onboarding as next step
        router.push('/onboarding');
    };

    return (
        <main className="min-h-screen bg-white p-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-tr-full -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Who are you?</h1>
                    <p className="text-slate-500 font-medium">Select your role to customize the app.</p>
                </div>

                <div className="space-y-4">
                    {roles.map((role) => (
                        <motion.div
                            key={role.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelected(role.id)}
                            className={`
                relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4
                ${selected === role.id
                                    ? `${role.color.replace('bg-', 'bg-opacity-20 ')} border-current shadow-lg`
                                    : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}
              `}
                        >
                            <div className={`p-3 rounded-xl ${role.color}`}>
                                {role.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">{role.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{role.desc}</p>
                            </div>

                            {selected === role.id && (
                                <div className="bg-green-600 rounded-full p-1 absolute top-4 right-4">
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full mt-10 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-transform"
                >
                    Continue
                </button>

            </div>
        </main>
    );
}
