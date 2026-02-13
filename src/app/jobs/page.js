'use client';
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, IndianRupee, Plus, Phone, X, Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export default function Jobs() {
    const [role, setRole] = useState('farmer');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        wage: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) setRole(storedRole);
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsPosting(false);
                setFormData({ title: '', location: '', wage: '', description: '' });
                fetchJobs(); // Refresh list
                alert('Job Posted Successfully!');
            }
        } catch (error) {
            alert('Failed to post job. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white p-6 rounded-b-[2rem] shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Krishi Rozgar</h1>
                        <p className="text-sm text-slate-500 font-medium">Find Jobs or Hire Workers</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-full">
                        <Briefcase className="text-blue-600" size={24} />
                    </div>
                </div>

                {role === 'farmer' && (
                    <button
                        onClick={() => setIsPosting(true)}
                        className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                        <Plus size={20} />
                        Post a Job
                    </button>
                )}
            </div>

            {/* Job Feed */}
            <div className="px-5 mt-6 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-slate-400" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No jobs available currently.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{job.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{job.employer || 'Farmer'}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                                    ₹{job.wage || job.wage_per_day}/day
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-4">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || 'Local'}</span>
                                <span>•</span>
                                <span>{job.type || 'Contract'}</span>
                            </div>

                            <div className="flex gap-2 mb-4">
                                {(job.tags || ['General']).map(tag => (
                                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-green-200 shadow-md flex items-center justify-center gap-2">
                                    <Phone size={16} /> Call
                                </button>
                                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-sm">
                                    Details
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Post Job Modal */}
            <AnimatePresence>
                {isPosting && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsPosting(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Post New Job</h2>
                                <button onClick={() => setIsPosting(false)} className="bg-slate-100 p-2 rounded-full">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Job Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Cotton Picking"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800 outline-none focus:border-green-500"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Wage (₹/Day)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.wage}
                                            onChange={e => setFormData({ ...formData, wage: e.target.value })}
                                            placeholder="500"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800 outline-none focus:border-green-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                                        <input
                                            required
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Village Name"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-800 outline-none focus:border-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Requirements..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 outline-none focus:border-green-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform disabled:opacity-70"
                                >
                                    {submitting ? 'Posting...' : 'Confirm Post'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BottomNav />
        </main>
    );
}
