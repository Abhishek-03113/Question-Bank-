'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import DetailModal from '@/components/DetailModal';
import { useListData } from '@/hooks/useListData';

interface JobPortal {
    _id: string;
    id: number;
    name: string;
    description: string;
    category: string;
    website_url: string;
    logo_url: string;
    is_premium: boolean;
    job_types: string[];
    locations: string[];
    rating: number;
    popularity: number;
}

export default function JobPortalsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [isPremium, setIsPremium] = useState('');
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const params = {
        page,
        limit: 20,
        ...(search && { search }),
        ...(category && { category }),
        ...(isPremium && { is_premium: isPremium }),
    };

    const { data, total, totalPages, loading, error } = useListData<JobPortal>('/api/v1/job-portals', params);
    const { data: categories } = useListData<string>('/api/v1/job-portals/categories', {});

    const handleSearchChange = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

    return (
        <div className="min-h-screen bg-bgPrimary text-textPrimary p-6 relative overflow-hidden">
            {/* Background effects matching Home */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-accentLime/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-10 border-b border-border/50 pb-6">
                    <h1 className="text-2xl font-black text-textPrimary tracking-tight flex items-center">
                        <span className="mr-3 opacity-80">🌐</span> JOB PORTALS
                    </h1>
                    <Link href="/" className="font-mono text-[11px] font-bold tracking-widest uppercase text-textMuted hover:text-accentLime transition-colors">
                        {"// BACK TO ARSENAL"}
                    </Link>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="[ SEARCH PORTALS ]"
                        className="flex-1 min-w-[200px] px-4 py-3 bg-surface border border-border/60 rounded-md text-sm text-textPrimary placeholder:text-textMuted/50 focus:outline-none focus:border-accentLime/50 transition-colors font-mono"
                    />
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-surface border border-border/60 rounded-md text-sm text-textPrimary focus:outline-none focus:border-accentLime/50 transition-colors font-mono uppercase tracking-wide"
                    >
                        <option value="">[ ALL CATEGORIES ]</option>
                        {(categories as string[]).map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={isPremium}
                        onChange={(e) => { setIsPremium(e.target.value); setPage(1); }}
                        className="px-4 py-3 bg-surface border border-border/60 rounded-md text-sm text-textPrimary focus:outline-none focus:border-accentLime/50 transition-colors font-mono uppercase tracking-wide"
                    >
                        <option value="">[ ALL PLANS ]</option>
                        <option value="false">FREE</option>
                        <option value="true">PREMIUM</option>
                    </select>
                </div>

                {!loading && !error && (
                    <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-textMuted mb-6 flex items-center">
                        <span className="opacity-50 mr-2">[ SYSTEM ]</span> SHOWING {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} OF {total}
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}

                {!loading && (data as JobPortal[]).map((portal, idx) => (
                    <div
                        key={portal._id || idx}
                        className="card-premium mb-4 flex justify-between items-start gap-5 p-6 rounded-xl"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-textPrimary mb-2 tracking-tight">{portal.name}</h3>
                            <p className="text-sm text-textMuted/80 font-medium leading-relaxed line-clamp-2 mb-4">{portal.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {portal.category && (
                                    <span className="px-2.5 py-1 bg-surface border border-border text-textMuted font-mono text-[10px] font-bold uppercase tracking-widest rounded-md">{portal.category}</span>
                                )}
                                {portal.is_premium && (
                                    <span className="px-2.5 py-1 bg-accentPink/5 border border-accentPink/30 text-accentPink font-mono text-[10px] font-bold uppercase tracking-widest rounded-md">PREMIUM</span>
                                )}
                                {portal.rating && (
                                    <span className="px-2.5 py-1 bg-accentLime/5 border border-accentLime/30 text-accentLime font-mono text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center">
                                        <span className="mr-1 opacity-70">★</span> {portal.rating}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            {portal.website_url && (
                                <a
                                    href={portal.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-accentLime/5 border border-accentLime/30 text-accentLime hover:bg-accentLime/10 font-mono text-[11px] uppercase font-bold tracking-widest rounded-md transition-colors text-center"
                                >
                                    [ VISIT ]
                                </a>
                            )}
                            <button
                                onClick={() => setSelectedItem(portal as unknown as Record<string, unknown>)}
                                className="px-4 py-2 bg-surface hover:bg-surface/80 border border-border/80 hover:border-accentPink/50 text-textMuted hover:text-accentPink font-mono text-[11px] uppercase font-bold tracking-widest rounded-md transition-all text-center"
                            >
                                [ VIEW ]
                            </button>
                        </div>
                    </div>
                ))}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <DetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                titleField="name"
            />
        </div>
    );
}
