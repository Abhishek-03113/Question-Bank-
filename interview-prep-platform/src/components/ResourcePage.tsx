'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import FilterBar from './FilterBar';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';
import DetailModal from './DetailModal';
import GamificationBar from './GamificationBar';
import { useListData } from '@/hooks/useListData';
import { useGamification } from '@/hooks/useGamification';

interface ResourcePageProps {
    title: string;
    icon: string;
    apiEndpoint: string;
    /** Domain key used for gamification progress tracking. Optional — gamification is disabled if omitted. */
    domain?: string;
    titleField?: string;
    descriptionField?: string;
    showDifficulty?: boolean;
    showCategory?: boolean;
    showSection?: boolean;
    categoryFilterLabel?: string;
    sectionFilterLabel?: string;
    categoriesEndpoint?: string;
    sectionsEndpoint?: string;
    extraFilters?: (filters: Record<string, string>, setFilters: (f: Record<string, string>) => void) => React.ReactNode;
    renderModalContent?: (item: Record<string, unknown>) => React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCardProps?: (item: any) => {
        title: string;
        description?: string;
        difficulty?: string;
        category?: string;
        section?: string;
        tags?: string[];
    };
}

export default function ResourcePage({
    title,
    icon,
    apiEndpoint,
    domain,
    titleField = 'question',
    descriptionField,
    showDifficulty = true,
    showCategory = false,
    showSection = false,
    categoriesEndpoint,
    sectionsEndpoint,
    extraFilters,
    renderModalContent,
    getCardProps,
}: ResourcePageProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');
    const [section, setSection] = useState('');
    const [extraFilterState, setExtraFilterState] = useState<Record<string, string>>({});
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const { profile, loading: gamLoading, recordActivity, isDone } = useGamification();

    const params = {
        page,
        limit: 20,
        ...(search && { search }),
        ...(difficulty && { difficulty }),
        ...(category && { category }),
        ...(section && { section }),
        ...extraFilterState,
    };

    const { data, total, totalPages, loading, error } = useListData<Record<string, unknown>>(
        apiEndpoint,
        params
    );

    const { data: categories } = useListData<string>(categoriesEndpoint || '', {});
    const { data: sections } = useListData<string>(sectionsEndpoint || '', {});

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleDifficultyChange = useCallback((val: string) => {
        setDifficulty(val);
        setPage(1);
    }, []);

    const handleCategoryChange = useCallback((val: string) => {
        setCategory(val);
        setPage(1);
    }, []);

    const handleSectionChange = useCallback((val: string) => {
        setSection(val);
        setPage(1);
    }, []);

    const handleExtraFilterChange = useCallback((f: Record<string, string>) => {
        setExtraFilterState(f);
        setPage(1);
    }, []);

    const handleView = useCallback(
        (item: Record<string, unknown>) => {
            setSelectedItem(item);
            if (domain) {
                const qId = `${domain}-${item.id ?? item._id}`;
                void recordActivity(qId, domain, 'viewed');
            }
        },
        [domain, recordActivity]
    );

    const handleMarkDone = useCallback(
        (item: Record<string, unknown>) => {
            if (!domain) return;
            const qId = `${domain}-${item.id ?? item._id}`;
            void recordActivity(qId, domain, 'done');
        },
        [domain, recordActivity]
    );

    return (
        <div className="min-h-screen theme-bg text-textPrimary p-6 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-4">
                    <h1 className="text-2xl font-black tracking-tight text-textPrimary uppercase">
                        <span className="mr-3 filter grayscale opacity-80">{icon}</span>
                        {title}
                    </h1>
                    <Link href="/" className="text-sm font-mono text-accentLime hover:text-white transition-colors uppercase tracking-widest">
                        // BACK TO ARSENAL
                    </Link>
                </div>

                {/* Gamification Bar */}
                {domain && (
                    <div className="mb-6">
                        <GamificationBar profile={profile} loading={gamLoading} domain={domain} />
                    </div>
                )}

                <FilterBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    difficulty={showDifficulty ? difficulty : ''}
                    onDifficultyChange={showDifficulty ? handleDifficultyChange : () => { }}
                    category={showCategory ? category : undefined}
                    onCategoryChange={showCategory ? handleCategoryChange : undefined}
                    categories={showCategory ? (categories as string[]) : []}
                    section={showSection ? section : undefined}
                    onSectionChange={showSection ? handleSectionChange : undefined}
                    sections={showSection ? (sections as string[]) : []}
                    extraFilters={extraFilters ? extraFilters(extraFilterState, handleExtraFilterChange) : undefined}
                />

                {!loading && !error && (
                    <p className="text-xs font-mono text-textMuted mb-6 uppercase tracking-widest">
                        [ SYSTEM ALIGNMENT ] &nbsp;//&nbsp; SHOWING {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} OF {total}
                    </p>
                )}

                {loading && (
                    <div className="text-center py-20 text-accentLime text-sm font-mono tracking-widest animate-pulse">
                        INITIALIZING DATA MATRIX...
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 text-accentPink text-sm font-mono tracking-widest uppercase border border-accentPink/20 bg-accentPink/5 rounded-lg">
                        [ ERROR ] // {error}
                    </div>
                )}

                {!loading && !error && data.length === 0 && (
                    <div className="text-center py-20 text-textMuted text-sm font-mono tracking-widest uppercase opacity-60">
                        NO ASSETS DEPLOYED.
                    </div>
                )}

                {!loading &&
                    data.map((item, idx) => {
                        const cardProps = getCardProps
                            ? getCardProps(item)
                            : {
                                title: (item[titleField] || item.Title || '') as string,
                                description: descriptionField ? (item[descriptionField] as string) : undefined,
                                difficulty: item.difficulty as string | undefined,
                                category: item.category as string | undefined,
                                section: item.section as string | undefined,
                            };
                        const questionId = domain ? `${domain}-${item.id ?? item._id}` : undefined;
                        return (
                            <QuestionCard
                                key={(item._id as string) || idx}
                                {...cardProps}
                                onView={() => handleView(item)}
                                onMarkDone={domain ? () => handleMarkDone(item) : undefined}
                                isDone={questionId ? isDone(questionId) : undefined}
                            />
                        );
                    })}

                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            <DetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                titleField={titleField}
                renderContent={renderModalContent}
            />
        </div>
    );
}