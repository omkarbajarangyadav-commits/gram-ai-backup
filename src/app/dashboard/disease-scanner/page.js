'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertTriangle, ChevronRight, Activity, Beaker, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DiseaseScanner() {
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const runScan = () => {
        setScanning(true);
        // Simulate AI API call
        setTimeout(() => {
            setScanning(false);
            setResult({
                disease: 'Early Blight (Alternaria solani)',
                confidence: 94.2,
                severity: 'Moderate',
                treatment: [
                    'Prune and destroy infected lower leaves.',
                    'Apply copper-based fungicide immediately.',
                    'Improve air circulation around plants.'
                ]
            });
        }, 2500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">

            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-l-4 border-l-primary p-6 rounded-2xl shadow-sm pl-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 mb-1">
                    <Activity className="text-primary w-6 h-6" /> AI Disease Scanner
                    <span className="bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-2">Beta</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium">Upload a photo of your crop's leaf to get an instant diagnosis and treatment plan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Upload Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground">1. Upload Image</h2>
                    <div className="bg-card border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] relative group cursor-pointer shadow-sm overflow-hidden">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleUpload} accept="image/*" />

                        {image ? (
                            <div className="absolute inset-0 z-10 p-2">
                                <img src={image} className="w-full h-full object-cover rounded-2xl shadow-inner border border-border" alt="Uploaded leaf" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-6 pt-12 rounded-b-2xl">
                                    <p className="text-white text-sm font-semibold flex items-center justify-center gap-2">
                                        <UploadCloud className="w-4 h-4" /> Tap to replace image
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                                    <UploadCloud className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Drag & Drop Image</h3>
                                <p className="text-sm font-medium text-muted-foreground mb-6 max-w-[250px]">Support for JPG, PNG, and HEIC up to 10MB.</p>
                                <div className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-md group-hover:shadow-lg transition-all">Browse Files</div>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={!image || scanning}
                        onClick={runScan}
                        className={cn(
                            "w-full py-4 rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-2 shadow-lg",
                            !image ? "bg-muted text-muted-foreground cursor-not-allowed hidden" :
                                scanning ? "bg-primary/80 text-primary-foreground cursor-wait animate-pulse" :
                                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl"
                        )}
                    >
                        {scanning ? (
                            <><Activity className="animate-spin w-5 h-5" /> Analyzing Plant Cells...</>
                        ) : (
                            <><Beaker className="w-5 h-5" /> Analyze Image</>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground">2. Diagnosis</h2>

                    <AnimatePresence mode="popLayout">
                        {!result && !scanning && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm">
                                <Sprout className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-bold text-muted-foreground mb-2">Awaiting Image</h3>
                                <p className="text-sm font-medium text-muted-foreground max-w-[200px]">Upload an image to see the AI diagnosis here.</p>
                            </motion.div>
                        )}

                        {scanning && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-card border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)] rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse"></div>
                                <div className="w-24 h-24 border-4 border-muted border-t-primary rounded-full animate-spin mb-6"></div>
                                <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">Running Deep Learning Models</h3>
                                <p className="text-sm font-medium text-primary animate-pulse relative z-10">Cross-referencing 10,000+ pathogens...</p>
                            </motion.div>
                        )}

                        {result && !scanning && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                                <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-3xl p-6 shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Detected Pathogen</p>
                                            <h3 className="text-2xl font-extrabold text-foreground">{result.disease}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-foreground">{result.confidence}<span className="text-base font-bold text-muted-foreground">%</span></div>
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Confidence</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                                            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> AI Recommended Treatment</h4>
                                            <ul className="space-y-3">
                                                {result.treatment.map((step, i) => (
                                                    <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">{i + 1}</span>
                                                        <span className="leading-relaxed">{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="bg-card border border-border hover:bg-muted font-bold text-sm py-3 rounded-2xl transition-colors shadow-sm">Save Report</button>
                                    <button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold text-sm py-3 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2">Order Treatment <ChevronRight className="w-4 h-4" /></button>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
