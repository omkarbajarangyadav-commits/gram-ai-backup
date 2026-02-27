'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, CheckCircle2, ShieldCheck, Sprout } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Heal Your Crop",
        titleHighlight: "Instantly",
        desc: "Take a photo of your sick plant. Our AI instantly detects diseases, pests, and nutrient deficiencies to provide a verified cure.",
        color: "bg-emerald-100/60 text-emerald-700",
        badge: "AI Plant Doctor",
        icon: "📸"
    },
    {
        id: 2,
        title: "Fertilizer",
        titleHighlight: "Calculator",
        desc: "Know exactly how much fertilizer your crop needs based on your plot size. Save money, avoid overuse, and protect your soil.",
        color: "bg-amber-100/60 text-amber-700",
        badge: "Cost Saver",
        icon: "⚖️"
    },
    {
        id: 3,
        title: "Cultivation",
        titleHighlight: "Advisory",
        desc: "Follow best agricultural practices tailored to your crop's growth stages from sowing to harvest to maximize your yield.",
        color: "bg-lime-100/60 text-lime-700",
        badge: "Smart Farming",
        icon: "🌱"
    },
    {
        id: 4,
        title: "Pest & Disease",
        titleHighlight: "Alerts",
        desc: "Get real-time alerts about specific diseases spreading in your district and take preventative measures before they reach your farm.",
        color: "bg-rose-100/60 text-rose-700",
        badge: "Early Warning System",
        icon: "🚨"
    },
    {
        id: 5,
        title: "Expert",
        titleHighlight: "Community",
        desc: "Share photos and ask questions. Get verified answers and solutions from leading agricultural experts within hours!",
        color: "bg-blue-100/60 text-blue-700",
        badge: "Social Network",
        icon: "🤝"
    }
];

export default function Onboarding() {
    const [[page, direction], setPage] = useState([0, 0]);
    const router = useRouter();

    const slideIndex = Math.abs(page % slides.length);

    const paginate = (newDirection) => {
        if (slideIndex === slides.length - 1 && newDirection === 1) {
            router.push('/language');
            return;
        }
        if (slideIndex === 0 && newDirection === -1) {
            return; // Can't go back from first slide
        }
        setPage([page + newDirection, newDirection]);
    };

    const skip = () => {
        router.push('/language');
    };

    const variants = {
        enter: (direction) => {
            return {
                x: direction > 0 ? 300 : -300,
                opacity: 0,
                scale: 0.9,
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 300 : -300,
                opacity: 0,
                scale: 0.9,
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden">

            {/* Top Navigation */}
            <div className="flex justify-between items-center p-6 relative z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-md">
                        <Sprout size={18} />
                    </div>
                    <span className="font-extrabold text-slate-800 text-lg tracking-tight">SmartFarm</span>
                </div>
                <button
                    onClick={skip}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Skip
                </button>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-[url('https://grain-image.s3.amazonaws.com/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                <motion.div
                    animate={{ backgroundColor: slides[slideIndex].color.split(' ')[0].replace('/60', '/20') }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[100vw] rounded-full blur-[120px] opacity-60 transition-colors duration-1000"
                />
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full px-6">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="w-full max-w-sm mx-auto flex flex-col items-center text-center cursor-grab active:cursor-grabbing"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className={`w-56 h-56 mx-auto ${slides[slideIndex].color} rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-200/50 border-4 border-white relative`}
                        >
                            <span className="text-8xl drop-shadow-lg">{slides[slideIndex].icon}</span>

                            <div className="absolute -bottom-4 bg-white px-4 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-1.5">
                                <ShieldCheck size={14} className={slides[slideIndex].color.split(' ')[1]} />
                                <span className={`text-[10px] font-black uppercase tracking-wider ${slides[slideIndex].color.split(' ')[1]}`}>
                                    {slides[slideIndex].badge}
                                </span>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-extrabold text-slate-800 mb-4 leading-tight"
                        >
                            {slides[slideIndex].title} <span className={slides[slideIndex].color.split(' ')[1]}>{slides[slideIndex].titleHighlight}</span>
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-500 font-medium leading-relaxed text-[15px] px-2"
                        >
                            {slides[slideIndex].desc}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="w-full p-6 pb-[120px] relative z-20 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const newDirection = i > slideIndex ? 1 : -1;
                                setPage([i, newDirection]);
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${i === slideIndex ? 'w-8 bg-green-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="flex gap-4 max-w-sm mx-auto">
                    <button
                        onClick={() => paginate(-1)}
                        className={`p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all hover:bg-slate-50 active:scale-95 ${slideIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => paginate(1)}
                        className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-green-700 hover:shadow-green-600/30"
                    >
                        <span>{slideIndex === slides.length - 1 ? "Start Farming" : "Continue"}</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

        </main>
    );
}
