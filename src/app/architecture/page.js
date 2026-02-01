'use client';

export default function Architecture() {
    return (
        <main style={{ paddingBottom: '80px' }}>
            <div className="header">
                <h2 className="text-green">System Architecture</h2>
                <p>Technical Overview</p>
            </div>

            <div style={{ padding: '0 20px' }}>

                {/* System Architecture */}
                <div className="card">
                    <h3 className="mb-4">1. High-Level Architecture</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <svg viewBox="0 0 400 300" style={{ minWidth: '100%' }}>
                            <rect x="10" y="10" width="380" height="280" fill="#F5F5F5" rx="10" />

                            {/* Clients */}
                            <rect x="30" y="30" width="80" height="60" fill="#E8F5E9" stroke="#2E7D32" rx="4" />
                            <text x="70" y="65" textAnchor="middle" fontSize="10" fill="#2E7D32">Mobile App</text>

                            <rect x="30" y="110" width="80" height="60" fill="#E8F5E9" stroke="#2E7D32" rx="4" />
                            <text x="70" y="145" textAnchor="middle" fontSize="10" fill="#2E7D32">Web Dashboard</text>

                            {/* Gateway */}
                            <rect x="150" y="30" width="40" height="140" fill="#FFF3E0" stroke="#FF9800" rx="4" />
                            <text x="170" y="100" textAnchor="middle" fontSize="10" fill="#EF6C00" transform="rotate(270 170 100)">API Gateway</text>

                            {/* Services */}
                            <rect x="230" y="30" width="120" height="140" fill="#E3F2FD" stroke="#1565C0" rx="4" />
                            <text x="290" y="50" textAnchor="middle" fontSize="10" fill="#1565C0" fontWeight="bold">Microservices</text>
                            <rect x="240" y="60" width="100" height="20" fill="white" stroke="#90CAF9" />
                            <text x="290" y="74" textAnchor="middle" fontSize="8" fill="#1565C0">Auth Service</text>
                            <rect x="240" y="85" width="100" height="20" fill="white" stroke="#90CAF9" />
                            <text x="290" y="99" textAnchor="middle" fontSize="8" fill="#1565C0">Crop/AI Service</text>
                            <rect x="240" y="110" width="100" height="20" fill="white" stroke="#90CAF9" />
                            <text x="290" y="124" textAnchor="middle" fontSize="8" fill="#1565C0">Market Service</text>

                            {/* DB */}
                            <path d="M 230 200 C 230 190 350 190 350 200 L 350 240 C 350 250 230 250 230 240 Z" fill="#F3E5F5" stroke="#7B1FA2" />
                            <path d="M 230 200 C 230 210 350 210 350 200" fill="none" stroke="#7B1FA2" />
                            <text x="290" y="225" textAnchor="middle" fontSize="10" fill="#7B1FA2">Database Cluster</text>

                            {/* Connections */}
                            <line x1="110" y1="60" x2="150" y2="60" stroke="#9E9E9E" strokeWidth="1" />
                            <line x1="110" y1="140" x2="150" y2="140" stroke="#9E9E9E" strokeWidth="1" />
                            <line x1="190" y1="100" x2="230" y2="100" stroke="#9E9E9E" strokeWidth="1" />
                            <line x1="290" y1="170" x2="290" y2="190" stroke="#9E9E9E" strokeWidth="1" />
                        </svg>
                    </div>
                </div>

                {/* Data Flow */}
                <div className="card mt-4">
                    <h3 className="mb-4">2. AI Data Workflow</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <svg viewBox="0 0 400 150" style={{ minWidth: '100%' }}>
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#757575" />
                                </marker>
                            </defs>

                            <circle cx="40" cy="75" r="30" fill="#E8F5E9" stroke="#2E7D32" />
                            <text x="40" y="80" textAnchor="middle" fontSize="8">Farmer</text>

                            <line x1="70" y1="75" x2="100" y2="75" stroke="#757575" strokeWidth="2" markerEnd="url(#arrow)" />

                            <rect x="110" y="45" width="60" height="60" fill="#FFF3E0" stroke="#FF9800" rx="4" />
                            <text x="140" y="70" textAnchor="middle" fontSize="8">Data</text>
                            <text x="140" y="82" textAnchor="middle" fontSize="8">Collection</text>

                            <line x1="170" y1="75" x2="200" y2="75" stroke="#757575" strokeWidth="2" markerEnd="url(#arrow)" />

                            <rect x="210" y="45" width="80" height="60" fill="#E3F2FD" stroke="#1565C0" rx="4" />
                            <text x="250" y="70" textAnchor="middle" fontSize="8" fontWeight="bold">AI Engine</text>
                            <text x="250" y="82" textAnchor="middle" fontSize="6">(ML Models + RAG)</text>

                            <line x1="290" y1="75" x2="320" y2="75" stroke="#757575" strokeWidth="2" markerEnd="url(#arrow)" />

                            <rect x="330" y="45" width="60" height="60" fill="#F3E5F5" stroke="#7B1FA2" rx="4" />
                            <text x="360" y="70" textAnchor="middle" fontSize="8">Actionable</text>
                            <text x="360" y="82" textAnchor="middle" fontSize="8">Insight</text>
                        </svg>
                    </div>
                </div>

            </div>
        </main>
    );
}
