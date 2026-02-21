'use client';

interface QuestionCardProps {
    title: string;
    description?: string;
    difficulty?: string;
    category?: string;
    section?: string;
    tags?: string[];
    onView: () => void;
}

const difficultyClasses: Record<string, string> = {
    easy: 'bg-accentLime/10 text-accentLime border-accentLime/30',
    medium: 'bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/30',
    hard: 'bg-accentPink/10 text-accentPink border-accentPink/30',
    Easy: 'bg-accentLime/10 text-accentLime border-accentLime/30',
    Medium: 'bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/30',
    Hard: 'bg-accentPink/10 text-accentPink border-accentPink/30',
};

export default function QuestionCard({
    title,
    description,
    difficulty,
    category,
    section,
    tags = [],
    onView,
}: QuestionCardProps) {
    return (
        <div className="card-premium p-6 mb-4 flex flex-col sm:flex-row justify-between items-start gap-6 group">
            <div className="flex-1 min-w-0">
                <h3 className="text-xl font-sans font-bold text-textPrimary mb-3 leading-snug group-hover:text-accentLime transition-colors">{title}</h3>
                {description && (
                    <p className="text-sm text-textMuted line-clamp-2 mb-4 font-medium leading-relaxed">{description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {difficulty && (
                        <span
                            className={`font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 border font-bold ${difficultyClasses[difficulty] || 'bg-surface border-border text-textMuted'
                                }`}
                        >
                            {difficulty}
                        </span>
                    )}
                    {category && (
                        <span className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 border bg-surface border-border text-textMuted">
                            {category}
                        </span>
                    )}
                    {section && (
                        <span className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 border bg-blue-500/10 border-blue-500/30 text-blue-400">
                            {section}
                        </span>
                    )}
                    {Array.isArray(tags) && tags.map((tag) => (
                        <span key={tag} className="font-mono uppercase text-[10px] tracking-widest px-2.5 py-1 border bg-surface border-border text-textMuted">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <button
                onClick={onView}
                className="shrink-0 w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accentLime/10 text-accentLime border border-accentLime/50 hover:border-accentLime text-xs font-mono font-bold uppercase tracking-widest transition-all focus:outline-none"
            >
                [ EXPLORE ]
            </button>
        </div>
    );
}
