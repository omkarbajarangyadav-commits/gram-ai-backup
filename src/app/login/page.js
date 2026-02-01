'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Lock } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (phone.length < 10) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.length < 4) return;
        setLoading(true);
        // Simulate verification
        setTimeout(() => {
            setLoading(false);
            router.push('/');
        }, 1500);
    };

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '32px',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(46, 125, 50, 0.15)',
                background: 'white'
            }}>
                {/* Logo/Branding */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#2E7D32',
                        borderRadius: '50%',
                        margin: '0 auto 16px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px'
                    }}>
                        🌱
                    </div>
                    <h1 className="text-green" style={{ margin: 0 }}>GramAI</h1>
                    <p style={{ fontSize: '14px', color: '#757575' }}>Your Smart Farming Assistant</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handlePhoneSubmit}>
                        <div className="mb-4">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#555' }}>Mobile Number</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#F5F5F5',
                                borderRadius: '12px',
                                padding: '12px',
                                border: '1px solid #E0E0E0'
                            }}>
                                <span style={{ color: '#757575', marginRight: '12px', fontWeight: '600' }}>+91</span>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="98765 43210"
                                    style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', height: "2rem", fontSize: '16px', fontWeight: '500' }}
                                    inputMode="numeric"
                                />
                                <Phone size={18} color="#9E9E9E" />
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={phone.length < 10 || loading}
                            style={{ marginTop: '24px', opacity: (phone.length < 10 || loading) ? 0.7 : 1 }}
                        >
                            {loading ? 'Sending OTP...' : 'Get OTP'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-4">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#555' }}>Enter OTP</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#F5F5F5',
                                borderRadius: '12px',
                                padding: '12px',
                                border: '1px solid #E0E0E0'
                            }}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="• • • •"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        width: '100%',
                                        outline: 'none',
                                        fontSize: '24px',
                                        fontWeight: '600',
                                        letterSpacing: '8px',
                                        textAlign: 'center'
                                    }}
                                    inputMode="numeric"
                                    autoFocus
                                />
                                <Lock size={18} color="#9E9E9E" />
                            </div>
                            <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '12px', color: '#757575' }}>
                                Sent to +91 {phone} <br />
                                <span style={{ color: '#2E7D32', fontWeight: '600', cursor: 'pointer' }} onClick={() => setStep(1)}>Edit Number</span>
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={otp.length < 4 || loading}
                            style={{ marginTop: '24px', opacity: (otp.length < 4 || loading) ? 0.7 : 1 }}
                        >
                            {loading ? 'Verifying...' : 'Login'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
