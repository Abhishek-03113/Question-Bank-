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
        <div className="flex flex-wrap gap-3 mb-4">
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="🔍 Search questions..."
                className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            />
            <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
            >
                <option value="">All Difficulties</option>
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                >
                    <option value="">All Categories</option>
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
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                >
                    <option value="">All Sections</option>
                    {sections.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            )}
            {extraFilters}
        </div>
    );
}
