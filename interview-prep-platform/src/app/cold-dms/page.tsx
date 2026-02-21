'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import DetailModal from '@/components/DetailModal';
import GamificationBar from '@/components/GamificationBar';
import { useListData } from '@/hooks/useListData';
import { useGamification } from '@/hooks/useGamification';

interface ColdDm {
    _id: string;
    id: string;
    Title: string;
    Description: string;
    Category: string;
}

export default function ColdDmsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const params = {
        page,
        limit: 20,
        ...(search && { search }),
        ...(category && { category }),
    };

    const { data, total, totalPages, loading, error } = useListData<ColdDm>('/api/v1/cold-dms', params);
    const { data: categories } = useListData<string>('/api/v1/cold-dms/categories', {});
    const { profile, loading: gamLoading, recordActivity } = useGamification();

    const handleSearchChange = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

    const handleView = useCallback((dm: ColdDm) => {
        setSelectedItem(dm as unknown as Record<string, unknown>);
        void recordActivity(`coldDms-${dm.id ?? dm._id}`, 'coldDms', 'viewed');
    }, [recordActivity]);

    const handleCopy = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-bgPrimary text-textPrimary p-6 relative overflow-hidden">
            {/* Background effects matching Home */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-accentPink/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-6">
                    <h1 className="text-2xl font-black text-textPrimary tracking-tight flex items-center">
                        <span className="mr-3 opacity-80">✉️</span> COLD DM TEMPLATES
                    </h1>
                    <Link href="/" className="font-mono text-[11px] font-bold tracking-widest uppercase text-textMuted hover:text-accentPink transition-colors">
                        {"// BACK TO ARSENAL"}
                    </Link>
                </div>

                <div className="mb-6">
                    <GamificationBar profile={profile} loading={gamLoading} domain="coldDms" />
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="[ SEARCH TEMPLATES ]"
                        className="flex-1 min-w-[200px] px-4 py-3 bg-surface border border-border/60 rounded-md text-sm text-textPrimary placeholder:text-textMuted/50 focus:outline-none focus:border-accentPink/50 transition-colors font-mono"
                    />
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-surface border border-border/60 rounded-md text-sm text-textPrimary focus:outline-none focus:border-accentPink/50 transition-colors font-mono uppercase tracking-wide"
                    >
                        <option value="">[ ALL CATEGORIES ]</option>
                        {(categories as string[]).map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {!loading && !error && (
                    <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-textMuted mb-6 flex items-center">
                        <span className="opacity-50 mr-2">[ SYSTEM ]</span> SHOWING {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} OF {total}
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}

                {!loading && (data as ColdDm[]).map((dm, idx) => (
                    <div
                        key={dm._id || idx}
                        className="card-premium mb-4 p-6 rounded-xl flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-start gap-5">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-textPrimary mb-3 tracking-tight">{dm.Title}</h3>
                                {dm.Category && (
                                    <span className="px-2.5 py-1 bg-surface border border-border text-textMuted font-mono text-[10px] font-bold uppercase tracking-widest rounded-md">{dm.Category}</span>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <button
                                    onClick={() => handleCopy(dm.Description, dm.id)}
                                    className={`px-4 py-2 font-mono text-[11px] uppercase font-bold tracking-widest rounded-md transition-all text-center ${copiedId === dm.id
                                        ? 'bg-accentLime/10 border border-accentLime/50 text-accentLime'
                                        : 'bg-surface hover:bg-surface/80 border border-border/80 hover:border-accentLime/50 text-textMuted hover:text-accentLime'
                                        }`}
                                >
                                    {copiedId === dm.id ? '[ ✓ COPIED ]' : '[ COPY ]'}
                                </button>
                                <button
                                    onClick={() => handleView(dm)}
                                    className="px-4 py-2 bg-surface hover:bg-surface/80 border border-border/80 hover:border-accentPink/50 text-textMuted hover:text-accentPink font-mono text-[11px] uppercase font-bold tracking-widest rounded-md transition-all text-center"
                                >
                                    [ VIEW ]
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-textMuted/80 font-medium leading-relaxed line-clamp-3">{dm.Description}</p>
                    </div>
                ))}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <DetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                titleField="Title"
            />
        </div>
    );
}
