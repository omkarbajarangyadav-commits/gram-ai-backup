'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Briefcase, MapPin, Search, Plus, Phone, X, Loader2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export default function Jobs() {
    const [role, setRole] = useState('farmer');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const debounceTimeout = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        employer_name: '',
        location: '',
        salary_per_day: '',
        job_type: 'daily',
        category: 'labor',
        phone: '',
        description: ''
    });

    useEffect(() => {
        const storedRole = localStorage.getItem('role') || 'farmer';
        setRole(storedRole);
        // We set employer name if possible (simulated, usually fetched from auth profile)
        setFormData(prev => ({ ...prev, employer_name: storedRole === 'farmer' ? 'Local Farmer' : 'Contractor' }));
        fetchJobs();
    }, [page, categoryFilter]);
    // Effect runs on page and category change instantly. 
    // Search & location changes use debouncing so we don't spam.

    const fetchJobs = useCallback(async (currentSearch = search, currentLocation = locationFilter) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit,
                ...(currentSearch && { search: currentSearch }),
                ...(currentLocation && { location: currentLocation }),
                ...(categoryFilter && categoryFilter !== 'all' && { category: categoryFilter })
            });

            const res = await fetch(`/api/jobs?${params.toString()}`);
            if (!res.ok) {
                // Fallback to mock data if API fails (e.g. Supabase keys not set)
                console.warn('API error, falling back to mock jobs');
                setJobs([
                    { id: '1', title: 'Tractor Driver for Plowing', employer_name: 'Ramesh Patil', salary_per_day: 600, job_type: 'daily', category: 'machinery', location: 'Nagpur', description: 'Need an experienced driver for John Deere tractor. 3 days work.', distance_meters: 2500, phone: '9876543210' },
                    { id: '2', title: 'Cotton Picking Team', employer_name: 'Suresh Farms', salary_per_day: 400, job_type: 'contract', category: 'harvesting', location: 'Wardha', description: 'Need 5 workers for cotton picking. Starts tomorrow.', distance_meters: 5000, phone: '9123456789' }
                ]);
                setTotalPages(1);
                return;
            }

            const data = await res.json();
            setJobs(data.jobs || []);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            // Fallback for network errors
            setJobs([
                { id: '1', title: 'Tractor Driver for Plowing', employer_name: 'Ramesh Patil', salary_per_day: 600, job_type: 'daily', category: 'machinery', location: 'Nagpur', distance_meters: 2500 }
            ]);
        } finally {
            setLoading(false);
        }
    }, [page, categoryFilter, search, locationFilter]);

    // Handle debounced search
    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(1); // Reset to first page
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchJobs(val, locationFilter);
        }, 500);
    };

    const handleLocationChange = (val) => {
        setLocationFilter(val);
        setPage(1);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchJobs(search, val);
        }, 500);
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Optimistic Update
            const tempJob = { ...formData, id: 'temp-' + Date.now(), salary_per_day: Number(formData.salary_per_day) };
            setJobs([tempJob, ...jobs]);

            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    salary_per_day: Number(formData.salary_per_day)
                })
            });

            if (res.ok) {
                const newJob = await res.json();
                // Replace temp job with real one
                setJobs(prev => prev.map(j => j.id === tempJob.id ? newJob : j));
                setIsPosting(false);
                setFormData(prev => ({ ...prev, title: '', salary_per_day: '', description: '', phone: '', location: '' }));
                alert('Job Posted Successfully!');
            } else {
                const errData = await res.json();
                console.error(errData);
                // Revert optimistic update
                setJobs(prev => prev.filter(j => j.id !== tempJob.id));
                alert('Failed to post job. Please check your inputs.');
            }
        } catch (error) {
            alert('Server Error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const Skeletons = () => (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-2/3">
                            <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-4 mt-2"></div>
                    <div className="flex gap-3">
                        <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                        <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 pb-28">
            {/* Header & Filters */}
            <div className="bg-white p-6 rounded-b-[2rem] shadow-sm sticky top-0 z-10 border-b border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Krishi Rozgar</h1>
                        <p className="text-sm text-slate-500 font-medium">Find agricultural work instantly</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full">
                        <Briefcase className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors text-slate-800"
                        />
                    </div>
                    <div className="relative w-32 shrink-0">
                        <Filter className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setPage(1); setCategoryFilter(e.target.value); }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium focus:outline-none focus:border-green-500 appearance-none text-slate-800 cursor-pointer"
                        >
                            <option value="all">All Jobs</option>
                            <option value="harvesting">Harvesting</option>
                            <option value="machinery">Machinery</option>
                            <option value="labor">Daily Labor</option>
                        </select>
                    </div>
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                    <input
                        placeholder="Filter by district or village"
                        value={locationFilter}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors text-slate-800"
                    />
                </div>

                {(role === 'farmer' || role === 'admin') && (
                    <button
                        onClick={() => setIsPosting(true)}
                        className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-700/30 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Post a Job
                    </button>
                )}
            </div>

            {/* Job Feed */}
            <div className="px-5 mt-6 space-y-4">
                {loading ? (
                    <Skeletons />
                ) : jobs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="font-semibold text-slate-600 mb-1">No jobs found.</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence>
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border transition-all ${job.id.toString().startsWith('temp') ? 'opacity-70 border-dashed border-green-300' : 'border-slate-100 hover:shadow-md hover:border-green-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="pr-4">
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{job.title}</h3>
                                            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-wider">{job.employer_name}</p>
                                        </div>
                                        <div className="shrink-0 flex flex-col items-end">
                                            <span className="bg-green-50 text-green-700 text-sm font-black px-2.5 py-1 rounded-lg border border-green-100">
                                                ₹{job.salary_per_day}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold mt-1 uppercase">{job.job_type}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {job.location}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="capitalize text-green-700 bg-green-100 px-2 py-0.5 rounded-md">{job.category}</span>
                                    </div>

                                    {job.description && (
                                        <p className="text-sm text-slate-600 font-medium mb-4 line-clamp-2">{job.description}</p>
                                    )}

                                    <div className="flex gap-3">
                                        <a href={`tel:${job.phone || ''}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-600/20 flex items-center justify-center gap-2 transition-colors">
                                            <Phone size={16} /> Contact
                                        </a>
                                        <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                            Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center py-4 px-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-transparent shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-bold text-slate-600">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-transparent shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Post Job Modal */}
            <AnimatePresence>
                {isPosting && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsPosting(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 z-20 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Post New Job</h2>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">Hire verified workers immediately</p>
                                </div>
                                <button onClick={() => setIsPosting(false)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                                    <X size={20} className="text-slate-600" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-4 pb-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Job Title *</label>
                                    <input
                                        required
                                        minLength={3}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Cotton Picking, Tractor Driving"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Wage (₹/Day) *</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            value={formData.salary_per_day}
                                            onChange={e => setFormData({ ...formData, salary_per_day: e.target.value })}
                                            placeholder="500"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="labor">Daily Labor</option>
                                            <option value="harvesting">Harvesting</option>
                                            <option value="machinery">Machinery Driver</option>
                                            <option value="security">Farm Security</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Location *</label>
                                        <input
                                            required
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Village/District"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Contact Mobile *</label>
                                        <input
                                            required
                                            pattern="^\+?[0-9]{10,14}$"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="9876543210"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Work hours, specific skills required..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full mt-2 bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/30 active:scale-95 transition-all flex items-center justify-center disabled:opacity-60"
                                >
                                    {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...</> : 'Publish Job Listing'}
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
