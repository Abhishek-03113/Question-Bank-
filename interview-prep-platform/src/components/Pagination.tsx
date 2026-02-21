'use client';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="flex justify-center gap-2 mt-12 pb-12 font-mono">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-border bg-surface text-textPrimary disabled:opacity-20 hover:border-accentLime transition-colors uppercase text-xs tracking-widest disabled:hover:border-border"
            >
                [ PREV ]
            </button>
            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className="px-4 py-2 text-textMuted text-xs tracking-widest">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`px-4 py-2 border text-xs tracking-widest transition-colors ${p === page
                            ? 'bg-accentLime text-[#000] border-accentLime font-bold'
                            : 'bg-surface border-border text-textPrimary hover:border-accentLime hover:text-accentLime'
                            }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-border bg-surface text-textPrimary disabled:opacity-20 hover:border-accentLime transition-colors uppercase text-xs tracking-widest disabled:hover:border-border"
            >
                [ NEXT ]
            </button>
        </div>
    );
}
