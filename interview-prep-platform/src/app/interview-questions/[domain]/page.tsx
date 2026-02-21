'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import QuestionCard from '@/components/QuestionCard';
import Pagination from '@/components/Pagination';
import DetailModal from '@/components/DetailModal';
import DomainNav from '@/components/DomainNav';
import GamificationBar from '@/components/GamificationBar';
import { useListData } from '@/hooks/useListData';
import { useGamification } from '@/hooks/useGamification';

interface InterviewQuestionsPageProps {
    params: { domain: string };
}

export default function InterviewQuestionsPage({ params }: InterviewQuestionsPageProps) {
    const { domain } = params;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const { profile, loading: gamLoading, recordActivity, isDone } = useGamification();

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

    const handleView = useCallback((item: Record<string, unknown>) => {
        setSelectedItem(item);
        const qId = `interviewQuestions-${item.id ?? item._id}`;
        void recordActivity(qId, 'interviewQuestions', 'viewed');
    }, [recordActivity]);

    const handleMarkDone = useCallback((item: Record<string, unknown>) => {
        const qId = `interviewQuestions-${item.id ?? item._id}`;
        void recordActivity(qId, 'interviewQuestions', 'done');
    }, [recordActivity]);

    const domainLabel = domain.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="min-h-screen bg-bgPrimary text-textPrimary p-6 relative overflow-hidden">
            {/* Background effects matching Home */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-accentLime/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-6">
                    <h1 className="text-2xl font-black text-textPrimary tracking-tight flex items-center uppercase">
                        <span className="mr-3 opacity-80">🎤</span> {domainLabel} QUESTIONS
                    </h1>
                    <Link href="/" className="font-mono text-[11px] font-bold tracking-widest uppercase text-textMuted hover:text-accentLime transition-colors">
                        {"// BACK TO ARSENAL"}
                    </Link>
                </div>

                {/* Gamification Bar */}
                <div className="mb-6">
                    <GamificationBar profile={profile} loading={gamLoading} domain="interviewQuestions" />
                </div>

                <DomainNav activeDomain={domain} />

                <FilterBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    difficulty={difficulty}
                    onDifficultyChange={handleDifficultyChange}
                />

                {!loading && !error && (
                    <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-textMuted mt-4 mb-6 flex items-center">
                        <span className="opacity-50 mr-2">[ SYSTEM ]</span> SHOWING {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} OF {total}
                    </p>
                )}

                {loading && <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}
                {error && <div className="text-center py-12 text-red-500 text-sm">{error}</div>}
                {!loading && !error && data.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No results found.</div>
                )}

                {!loading && data.map((item, idx) => {
                    const qId = `interviewQuestions-${item.id ?? item._id}`;
                    return (
                        <QuestionCard
                            key={(item._id as string) || idx}
                            title={item.question as string}
                            difficulty={item.difficulty as string | undefined}
                            section={item.section as string | undefined}
                            onView={() => handleView(item)}
                            onMarkDone={() => handleMarkDone(item)}
                            isDone={isDone(qId)}
                        />
                    );
                })}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} titleField="question" />
        </div>
    );
}
