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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-lg font-bold text-gray-900">🌐 Job Portals</h1>
                    <Link href="/" className="text-sm text-blue-500 hover:underline">← Back to Dashboard</Link>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="🔍 Search portals..."
                        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="">All Categories</option>
                        {(categories as string[]).map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={isPremium}
                        onChange={(e) => { setIsPremium(e.target.value); setPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="">All Plans</option>
                        <option value="false">Free</option>
                        <option value="true">Premium</option>
                    </select>
                </div>

                {!loading && !error && (
                    <p className="text-xs text-gray-400 mb-3">
                        Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total} portals
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}

                {!loading && (data as JobPortal[]).map((portal, idx) => (
                    <div
                        key={portal._id || idx}
                        className="bg-white rounded-lg p-4 border border-gray-200 mb-3 flex justify-between items-start gap-4 hover:border-blue-300 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{portal.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{portal.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {portal.category && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{portal.category}</span>
                                )}
                                {portal.is_premium && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">Premium</span>
                                )}
                                {portal.rating && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">⭐ {portal.rating}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {portal.website_url && (
                                <a
                                    href={portal.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-50 text-xs rounded-lg transition-colors"
                                >
                                    Visit
                                </a>
                            )}
                            <button
                                onClick={() => setSelectedItem(portal as unknown as Record<string, unknown>)}
                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                            >
                                View
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
