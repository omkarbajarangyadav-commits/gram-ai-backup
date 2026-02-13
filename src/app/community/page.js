'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Share2, Search, Plus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';



export default function Community() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/community');
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching community posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Loading State
    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 px-5 py-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-slate-800">Community</h1>
                    <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                        My Posts
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        placeholder="Search questions..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Feed */}
            <div className="px-5 mt-6 space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
                                {post.user[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{post.user}</h3>
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">{post.crop}</span>
                            </div>
                        </div>

                        {/* Question */}
                        <p className="text-slate-700 font-medium mb-3 leading-relaxed">
                            {post.question}
                        </p>

                        {/* Image (Mock) */}
                        <div className="h-48 bg-slate-200 rounded-2xl mb-4 overflow-hidden relative">
                            <img src={post.image} alt="Crop Issue" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Expert Answer */}
                        {post.expertAnswer && (
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100 mb-4 flex gap-3 items-start">
                                <div className="bg-green-600 text-white p-1 rounded-full mt-0.5">
                                    <MessageCircle size={12} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-green-800 mb-0.5">Expert Answer</p>
                                    <p className="text-xs text-green-700 leading-snug">{post.expertAnswer}</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-600 transition-colors">
                                <ThumbsUp size={18} />
                                <span className="text-xs font-semibold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-600 transition-colors">
                                <MessageCircle size={18} />
                                <span className="text-xs font-semibold">{post.answers} Answers</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-600 transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAB - Ask Question */}
            <div className="fixed bottom-24 right-5 z-50">
                <button className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-green-300 hover:scale-110 transition-transform active:scale-90">
                    <Plus size={28} />
                </button>
            </div>

            <BottomNav />
        </main>
    );
}
