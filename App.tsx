import React, { useState, useMemo, useEffect, useRef } from 'react';
import MatrixRain from './components/MatrixRain';
import { SITE_LIST } from './services/siteData';
import { scanAllSites } from './services/scanner';
import { ScanResult, ResultStatus, ScanStatus, SiteCategory } from './types';

// Icons (using SVGs inline for single file requirement aesthetics)
const Icons = {
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    ExternalLink: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

const App: React.FC = () => {
    const [username, setUsername] = useState('');
    const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.IDLE);
    const [results, setResults] = useState<ScanResult[]>([]);
    const [progress, setProgress] = useState(0);
    const [useProxy, setUseProxy] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'FOUND' | 'AVAILABLE'>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    
    const resultsEndRef = useRef<HTMLDivElement>(null);

    // Scroll to new results only if user is near bottom (omitted for simplicity, just auto scrolling log style)
    
    const handleScan = async () => {
        if (!username.trim()) return;
        
        setScanStatus(ScanStatus.SCANNING);
        setResults([]);
        setProgress(0);
        
        let completed = 0;
        const total = SITE_LIST.length;

        await scanAllSites(SITE_LIST, username, useProxy, (result) => {
            setResults(prev => [...prev, result]);
            completed++;
            setProgress(Math.round((completed / total) * 100));
        });

        setScanStatus(ScanStatus.COMPLETED);
    };

    const filteredResults = useMemo(() => {
        return results.filter(r => {
            // Status Filter
            if (filter === 'FOUND' && r.status !== ResultStatus.FOUND) return false;
            if (filter === 'AVAILABLE' && r.status !== ResultStatus.NOT_FOUND) return false;
            
            // Category Filter
            if (categoryFilter !== 'ALL' && r.site.category !== categoryFilter) return false;
            
            return true;
        }).sort((a, b) => {
            // Sort FOUND first
            if (a.status === ResultStatus.FOUND && b.status !== ResultStatus.FOUND) return -1;
            if (a.status !== ResultStatus.FOUND && b.status === ResultStatus.FOUND) return 1;
            return 0;
        });
    }, [results, filter, categoryFilter]);

    const stats = useMemo(() => {
        return {
            total: results.length,
            found: results.filter(r => r.status === ResultStatus.FOUND).length,
            available: results.filter(r => r.status === ResultStatus.NOT_FOUND).length,
            errors: results.filter(r => r.status === ResultStatus.ERROR || r.status === ResultStatus.BLOCKED).length,
        };
    }, [results]);

    const exportResults = () => {
        const data = JSON.stringify(results, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nethunter_${username}_report.json`;
        a.click();
    };

    const openAllFound = () => {
        results.filter(r => r.status === ResultStatus.FOUND).forEach(r => {
            window.open(r.profileUrl, '_blank');
        });
    };

    return (
        <div className="min-h-screen text-green-500 font-mono relative crt selection:bg-green-900 selection:text-white">
            <MatrixRain />
            <div className="scan-line"></div>
            
            {/* Main Container */}
            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl flex flex-col min-h-screen">
                
                {/* Header */}
                <header className="mb-8 text-center border-b border-green-800 pb-6 bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-green-900 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 glow-text tracking-tighter">
                        NETHUNTER <span className="text-xs align-top opacity-70">v2025.1</span>
                    </h1>
                    <p className="text-green-700 text-sm md:text-base uppercase tracking-widest mb-4 type-writer">
                        Global Username Enumeration System
                    </p>
                    
                    {/* Input Area */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-3xl mx-auto mt-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-green-600">&gt;_</span>
                            </div>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                                placeholder="ENTER TARGET USERNAME..." 
                                className="w-full bg-black border-2 border-green-800 text-green-400 pl-10 pr-4 py-3 rounded focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all uppercase placeholder-green-900"
                            />
                        </div>
                        <button 
                            onClick={handleScan}
                            disabled={scanStatus === ScanStatus.SCANNING || !username}
                            className={`px-8 py-3 bg-green-900 text-black font-bold rounded hover:bg-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center border border-green-500`}
                        >
                            {scanStatus === ScanStatus.SCANNING ? 'SCANNING...' : 'START HUNT'}
                            {!scanStatus && <Icons.Search />}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-green-700">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-green-400">
                            <input 
                                type="checkbox" 
                                checked={useProxy} 
                                onChange={(e) => setUseProxy(e.target.checked)} 
                                className="accent-green-500"
                            />
                            <span>USE CORS PROXY (RECOMMENDED)</span>
                        </label>
                    </div>
                </header>

                {/* Dashboard */}
                {scanStatus !== ScanStatus.IDLE && (
                    <main className="flex-grow flex flex-col gap-6">
                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/50 border border-green-900 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-white glow-text">{stats.total}</div>
                                <div className="text-xs text-green-700 uppercase">Sites Scanned</div>
                            </div>
                            <div className="bg-green-900/20 border border-green-500 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-green-400 glow-text">{stats.found}</div>
                                <div className="text-xs text-green-600 uppercase">Found</div>
                            </div>
                            <div className="bg-black/50 border border-green-900 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-gray-400">{stats.available}</div>
                                <div className="text-xs text-green-700 uppercase">Not Found</div>
                            </div>
                            <div className="bg-black/50 border border-green-900 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                                <div className="text-xs text-red-900 uppercase">Errors/Blocked</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-2 bg-green-900/30 rounded overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_rgba(0,255,0,0.8)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap justify-between items-center gap-4 bg-black/60 p-2 rounded border border-green-900">
                            <div className="flex gap-2 text-xs overflow-x-auto pb-1 md:pb-0">
                                <button onClick={() => setFilter('ALL')} className={`px-3 py-1 rounded border ${filter === 'ALL' ? 'bg-green-900 border-green-500 text-white' : 'border-transparent text-green-700 hover:text-green-400'}`}>ALL</button>
                                <button onClick={() => setFilter('FOUND')} className={`px-3 py-1 rounded border ${filter === 'FOUND' ? 'bg-green-900 border-green-500 text-white' : 'border-transparent text-green-700 hover:text-green-400'}`}>FOUND</button>
                                <button onClick={() => setFilter('AVAILABLE')} className={`px-3 py-1 rounded border ${filter === 'AVAILABLE' ? 'bg-green-900 border-green-500 text-white' : 'border-transparent text-green-700 hover:text-green-400'}`}>AVAILABLE</button>
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="bg-black border border-green-900 text-green-500 text-xs px-2 py-1 rounded outline-none"
                                >
                                    <option value="ALL">ALL CATEGORIES</option>
                                    {Object.values(SiteCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={openAllFound} className="p-2 text-green-500 hover:text-white border border-green-900 hover:border-green-500 rounded" title="Open All Found">
                                    <Icons.ExternalLink />
                                </button>
                                <button onClick={exportResults} className="p-2 text-green-500 hover:text-white border border-green-900 hover:border-green-500 rounded" title="Export JSON">
                                    <Icons.Download />
                                </button>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="bg-black/80 border border-green-900 rounded-lg overflow-hidden shadow-lg flex-grow h-96 overflow-y-auto relative">
                           <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-900/20 text-green-300 sticky top-0 backdrop-blur-md z-10">
                                        <tr>
                                            <th className="p-3 font-bold w-16">STATUS</th>
                                            <th className="p-3 font-bold">SITE</th>
                                            <th className="p-3 font-bold hidden md:table-cell">CATEGORY</th>
                                            <th className="p-3 font-bold text-right">LINK</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-900/50">
                                        {filteredResults.map((res, idx) => (
                                            <tr key={idx} className="hover:bg-green-900/10 transition-colors group">
                                                <td className="p-3">
                                                    {res.status === ResultStatus.FOUND && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-200"><Icons.Check /> <span className="ml-1">FOUND</span></span>}
                                                    {res.status === ResultStatus.NOT_FOUND && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-gray-500">404</span>}
                                                    {res.status === ResultStatus.BLOCKED && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-500"><Icons.Alert /></span>}
                                                    {res.status === ResultStatus.ERROR && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/50 text-red-500"><Icons.X /></span>}
                                                </td>
                                                <td className="p-3 font-bold text-green-400">
                                                    {res.site.name}
                                                    <div className="text-[10px] text-green-800 md:hidden">{res.site.category}</div>
                                                </td>
                                                <td className="p-3 text-green-700 hidden md:table-cell">{res.site.category}</td>
                                                <td className="p-3 text-right">
                                                    {res.status === ResultStatus.FOUND ? (
                                                        <a 
                                                            href={res.profileUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-green-500 hover:text-white hover:underline"
                                                        >
                                                            VISIT <Icons.ExternalLink />
                                                        </a>
                                                    ) : <span className="text-green-900">-</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredResults.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-green-800 italic">
                                                    No results found matching filters...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                           </div>
                           <div ref={resultsEndRef} />
                        </div>
                    </main>
                )}
                
                {/* Footer */}
                <footer className="mt-auto py-6 text-center text-green-900 text-xs border-t border-green-900/50">
                    <p>SYSTEM READY // CONNECTED TO NODE 450 // SECURE CONNECTION</p>
                    <p className="mt-1 opacity-50">DISCLAIMER: FOR EDUCATIONAL & OSINT RESEARCH PURPOSES ONLY.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;