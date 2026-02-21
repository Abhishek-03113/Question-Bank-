'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import DetailModal from '@/components/DetailModal';
import { useListData } from '@/hooks/useListData';

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

    const handleSearchChange = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

    const handleCopy = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-lg font-bold text-gray-900">✉️ Cold DM Templates</h1>
                    <Link href="/" className="text-sm text-blue-500 hover:underline">← Back to Dashboard</Link>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="🔍 Search templates..."
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
                </div>

                {!loading && !error && (
                    <p className="text-xs text-gray-400 mb-3">
                        Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total} templates
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}

                {!loading && (data as ColdDm[]).map((dm, idx) => (
                    <div
                        key={dm._id || idx}
                        className="bg-white rounded-lg p-4 border border-gray-200 mb-3 hover:border-blue-300 transition-colors"
                    >
                        <div className="flex justify-between items-start gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">{dm.Title}</h3>
                                {dm.Category && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{dm.Category}</span>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => handleCopy(dm.Description, dm.id)}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${copiedId === dm.id
                                            ? 'bg-green-500 text-white'
                                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {copiedId === dm.id ? '✓ Copied' : 'Copy'}
                                </button>
                                <button
                                    onClick={() => setSelectedItem(dm as unknown as Record<string, unknown>)}
                                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-3">{dm.Description}</p>
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
