'use client';

interface QuestionCardProps {
    title: string;
    description?: string;
    difficulty?: string;
    category?: string;
    section?: string;
    tags?: string[];
    onView: () => void;
    /** Optional: called when user clicks "Mark Done". If undefined, footer is not rendered. */
    onMarkDone?: () => void;
    /** Optional: true if this question has been marked as done. */
    isDone?: boolean;
}

const difficultyClasses: Record<string, string> = {
    easy: 'bg-accentLime/10 text-accentLime',
    medium: 'bg-[#ff9900]/10 text-[#ff9900]',
    hard: 'bg-accentPink/10 text-accentPink',
    Easy: 'bg-accentLime/10 text-accentLime',
    Medium: 'bg-[#ff9900]/10 text-[#ff9900]',
    Hard: 'bg-accentPink/10 text-accentPink',
};

export default function QuestionCard({
    title,
    description,
    difficulty,
    category,
    section,
    tags = [],
    onView,
    onMarkDone,
    isDone = false,
}: QuestionCardProps) {
    const handleMarkDone = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDone && onMarkDone) onMarkDone();
    };

    return (
        <div
            onClick={onView}
            className={`card-premium p-6 mb-4 flex flex-col justify-between items-start gap-4 group cursor-pointer hover:bg-surface/80 ${isDone ? 'border-accentLime/20' : ''}`}
        >
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className={`text-xl font-sans font-bold leading-snug transition-colors ${isDone ? 'text-textPrimary/70' : 'text-textPrimary group-hover:text-accentLime'}`}>
                        {title}
                    </h3>
                    <span className={`shrink-0 transition-colors ${isDone ? 'text-accentLime' : 'text-textMuted/50 group-hover:text-accentLime/50'}`}>
                        {isDone ? '✓' : '↗'}
                    </span>
                </div>
                {description && (
                    <p className="text-[15px] text-textPrimary/80 line-clamp-2 mb-5 font-medium leading-relaxed">{description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {difficulty && (
                        <span
                            className={`font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-md font-bold ${difficultyClasses[difficulty] || 'bg-bgPrimary/50 text-textMuted'
                                }`}
                        >
                            {difficulty}
                        </span>
                    )}
                    {category && (
                        <span className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-bgPrimary/50 text-textMuted/80">
                            {category}
                        </span>
                    )}
                    {section && (
                        <span className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400">
                            {section}
                        </span>
                    )}
                    {Array.isArray(tags) && tags.map((tag) => (
                        <span key={tag} className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-bgPrimary/50 text-textMuted/80">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer row — only rendered when onMarkDone is provided */}
            {onMarkDone !== undefined && (
                <div
                    className="w-full flex justify-end items-center border-t border-border/50 pt-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    {isDone ? (
                        <span className="font-mono text-[10px] font-black tracking-widest uppercase px-4 py-1.5 border border-accentLime/50 text-accentLime rounded cursor-default">
                            ✓ DONE
                        </span>
                    ) : (
                        <button
                            onClick={handleMarkDone}
                            className="font-mono text-[10px] font-black tracking-widest uppercase px-4 py-1.5 bg-accentLime text-[#000] rounded hover:opacity-90 transition-opacity"
                        >
                            ✓ MARK DONE
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
