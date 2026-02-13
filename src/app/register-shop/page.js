'use client';
import { useState } from 'react';
import { Store, MapPin, Upload, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterShop() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        contact: '',
        category: 'Fertilizer',
        location: '',
        district: 'Pune'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/shops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Shop Registration Successful! Your shop is now listed.');
                router.push('/market'); // Redirect to market to see it
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            alert('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-10">
            {/* Header */}
            <div className="bg-white p-6 rounded-b-[2rem] shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-50 p-3 rounded-full">
                        <Store className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">Register Shop</h1>
                        <p className="text-sm text-slate-500 font-medium">Reach thousands of farmers</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 space-y-5 max-w-lg mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shop Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Ganesh Krishi Kendra"
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Owner Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Your Full Name"
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="9876543210"
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">District</label>
                            <select
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            >
                                <option value="Pune">Pune</option>
                                <option value="Satara">Satara</option>
                                <option value="Nashik">Nashik</option>
                                <option value="Akola">Akola</option>
                                <option value="Latur">Latur</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            {['Fertilizer', 'Seeds', 'Pesticides', 'Machinery'].map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`p-3 rounded-xl text-sm font-bold border transition-all ${formData.category === cat
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Village / Area</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                required
                                type="text"
                                placeholder="e.g. Narayangaon"
                                className="w-full mt-1 pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-colors"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Check strokeWidth={3} />}
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                </button>
            </form>
        </main>
    );
}
