'use client';

interface FilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    difficulty: string;
    onDifficultyChange: (value: string) => void;
    category?: string;
    onCategoryChange?: (value: string) => void;
    categories?: string[];
    section?: string;
    onSectionChange?: (value: string) => void;
    sections?: string[];
    extraFilters?: React.ReactNode;
}

export default function FilterBar({
    search,
    onSearchChange,
    difficulty,
    onDifficultyChange,
    category,
    onCategoryChange,
    categories = [],
    section,
    onSectionChange,
    sections = [],
    extraFilters,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-4 mb-8">
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="EXECUTE SEQUENCE [SEARCH]..."
                className="flex-1 min-w-[240px] px-4 py-3 bg-surface border border-border/80 text-textPrimary placeholder-textMuted/60 font-mono text-[13px] uppercase tracking-widest rounded-md focus:outline-none focus:border-accentLime focus:ring-1 focus:ring-accentLime/30 transition-all shadow-sm"
            />
            <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
                className="px-4 py-3 bg-surface border border-border/80 text-textPrimary font-mono text-[13px] uppercase tracking-widest rounded-md focus:outline-none focus:border-accentLime transition-all cursor-pointer shadow-sm"
            >
                <option value="">[ ALL THREAT LEVELS ]</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>
            {onCategoryChange && categories.length > 0 && (
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-4 py-3 bg-surface border border-border/80 text-textPrimary font-mono text-[13px] uppercase tracking-widest rounded-md focus:outline-none focus:border-accentLime transition-all cursor-pointer shadow-sm"
                >
                    <option value="">[ ALL DOMAINS ]</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            )}
            {onSectionChange && sections.length > 0 && (
                <select
                    value={section}
                    onChange={(e) => onSectionChange(e.target.value)}
                    className="px-4 py-3 bg-surface border border-border/80 text-textPrimary font-mono text-[13px] uppercase tracking-widest rounded-md focus:outline-none focus:border-accentLime transition-all cursor-pointer shadow-sm"
                >
                    <option value="">[ ALL NODE SECTORS ]</option>
                    {sections.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            )}
            {extraFilters && (
                <div className="flex gap-4 child:!bg-surface child:!border-border/80 child:!text-textPrimary child:!font-mono child:!text-[13px] child:!rounded-md child:!px-4 child:!py-3 child:!uppercase child:!tracking-widest child:!shadow-sm">
                    {extraFilters}
                </div>
            )}
        </div>
    );
}
