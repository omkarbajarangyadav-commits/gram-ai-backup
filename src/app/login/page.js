'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Phone, Lock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
    const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const router = useRouter();

    // Timer for Resend OTP
    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            setTimer(30);
            alert(`OTP sent to ${mobile}: 123456 (Mock)`);
        }, 1500);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            alert('Please enter a complete 6-digit OTP.');
            return;
        }
        setLoading(true);

        // Simulate Verification
        setTimeout(() => {
            if (enteredOtp === '123456') {
                router.push('/role');
            } else {
                alert('Invalid OTP. Please try again. (Hint: 123456)');
                setLoading(false);
            }
        }, 1500);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-green-50 rounded-b-[3rem] -z-10"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="mb-10 text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-200">
                        <span className="text-4xl">🌱</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Smart Farm</h1>
                    <p className="text-slate-500 mt-2 font-medium">Your Digital Farming Assistant</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 'mobile' ? (
                            <motion.div
                                key="mobile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Welcome Back!</h2>
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold flex items-center gap-2 border-r border-slate-200 pr-2">
                                                <Phone size={16} />
                                                <span>+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-24 pr-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                                placeholder="98765 43210"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                                            <>
                                                <span>Get OTP</span>
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-800">Verify OTP</h2>
                                    <button onClick={() => setStep('mobile')} className="text-xs font-bold text-green-600 hover:text-green-700">Change Number?</button>
                                </div>
                                <p className="text-sm text-slate-500 mb-6">
                                    We sent a code to <span className="font-bold text-slate-800">+91 {mobile}</span>
                                </p>

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="flex justify-between gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onFocus={(e) => e.target.select()}
                                                className="w-10 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                                            <>
                                                <Lock size={18} />
                                                <span>Verify & Login</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        {timer > 0 ? (
                                            <p className="text-xs text-slate-400 font-bold">Resend code in <span className="text-slate-600">{timer}s</span></p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => { setTimer(30); alert(`OTP Resent: 123456`); }}
                                                className="text-xs font-bold text-green-600 hover:text-green-700"
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 text-center border-t border-slate-50 pt-4">
                        <p className="text-xs text-slate-400">By continuing, you agree to our Terms & Privacy Policy.</p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
