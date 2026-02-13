'use client';
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, IndianRupee, Plus, Phone } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';

// Mock Data for Jobs
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Cotton Picking Labor Needed',
        employer: 'Rajesh Patil',
        location: 'Akola, MH',
        wage: '450',
        type: 'Daily',
        tags: ['Harvesting', 'Urgent']
    },
    {
        id: 2,
        title: 'Tractor Driver Required',
        employer: 'Kisan Agro Farm',
        location: 'Pune, MH',
        wage: '600',
        type: 'Daily',
        tags: ['Driving', 'Machinery']
    },
    {
        id: 3,
        title: 'Spraying Pesticides',
        employer: 'Suresh Deshmukh',
        location: 'Latur, MH',
        wage: '500',
        type: 'Daily',
        tags: ['Spraying']
    }
];

export default function Jobs() {
    const [role, setRole] = useState('farmer');
    const [jobs, setJobs] = useState(MOCK_JOBS);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) setRole(storedRole);
    }, []);

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
                    <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                        <Plus size={20} />
                        Post a Job
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="px-5 mt-6 space-y-4">
                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{job.title}</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">{job.employer}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                                ₹{job.wage}/day
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-4">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                        </div>

                        <div className="flex gap-2 mb-4">
                            {job.tags.map(tag => (
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
                ))}
            </div>

            <BottomNav />
        </main>
    );
}
