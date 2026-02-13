'use client';
import { useState } from 'react';
import { Briefcase, MapPin, IndianRupee, Phone, Calendar, User, Plus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// Mock Data
const MOCK_JOBS = [
    {
        id: 1,
        title: 'Cotton Picking',
        farmer: 'Ramesh Patil',
        location: 'Akola, MH',
        wage: '₹500 / day',
        type: 'Daily Wage',
        posted: '2 hrs ago',
        phone: '9876543210'
    },
    {
        id: 2,
        title: 'Sugarcane Harvesting',
        farmer: 'Suresh Deshmukh',
        location: 'Pune, MH',
        wage: '₹800 / ton',
        type: 'Contract',
        posted: '5 hrs ago',
        phone: '9123456780'
    }
];

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('find'); // 'find' or 'post'

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white p-6 sticky top-0 z-10 shadow-sm rounded-b-[2rem]">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Labor Market</h1>
                        <p className="text-sm text-slate-500 font-medium">Find work or hire workers</p>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-full">
                        <Briefcase className="text-orange-600" size={24} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('find')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'find' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Find Jobs
                    </button>
                    <button
                        onClick={() => setActiveTab('post')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Post Job
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 space-y-4">
                {activeTab === 'find' ? (
                    MOCK_JOBS.map((job) => (
                        <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{job.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                        <User size={12} /> {job.farmer} • {job.posted}
                                    </div>
                                </div>
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                    {job.type}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-700">{job.location}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                                    <IndianRupee size={16} className="text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-700">{job.wage}</span>
                                </div>
                            </div>

                            <a
                                href={`tel:${job.phone}`}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                <Phone size={18} />
                                Call Employer
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Plus size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Hire Workers</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Post a job listing to find reliable agriculture workers in your area.</p>
                        <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200">
                            Create Job Post
                        </button>
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
