'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import QuestionCard from '@/components/QuestionCard';
import Pagination from '@/components/Pagination';
import DetailModal from '@/components/DetailModal';
import DomainNav from '@/components/DomainNav';
import { useListData } from '@/hooks/useListData';

interface InterviewQuestionsPageProps {
    params: { domain: string };
}

export default function InterviewQuestionsPage({ params }: InterviewQuestionsPageProps) {
    const { domain } = params;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const apiParams = {
        page,
        limit: 20,
        ...(search && { search }),
        ...(difficulty && { difficulty }),
    };

    const apiEndpoint = `/api/v1/interview-questions/${domain}`;

    const { data, total, totalPages, loading, error } = useListData<Record<string, unknown>>(
        apiEndpoint,
        apiParams
    );

    const handleSearchChange = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
    const handleDifficultyChange = useCallback((val: string) => { setDifficulty(val); setPage(1); }, []);

    const domainLabel = domain.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-lg font-bold text-gray-900">🎤 Interview Questions — {domainLabel}</h1>
                    <Link href="/" className="text-sm text-blue-500 hover:underline">← Back to Dashboard</Link>
                </div>

                <DomainNav activeDomain={domain} />

                <FilterBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    difficulty={difficulty}
                    onDifficultyChange={handleDifficultyChange}
                />

                {!loading && !error && (
                    <p className="text-xs text-gray-400 mb-3">
                        Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total} results
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}
                {!loading && !error && data.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No results found.</div>
                )}

                {!loading && data.map((item, idx) => (
                    <QuestionCard
                        key={(item._id as string) || idx}
                        title={item.question as string}
                        difficulty={item.difficulty as string | undefined}
                        section={item.section as string | undefined}
                        onView={() => setSelectedItem(item)}
                    />
                ))}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} titleField="question" />
        </div>
    );
}
