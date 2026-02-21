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
}: QuestionCardProps) {
    return (
        <div
            onClick={onView}
            className="card-premium p-6 mb-4 flex flex-col justify-between items-start gap-4 group cursor-pointer hover:bg-surface/80"
        >
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl font-sans font-bold text-textPrimary leading-snug group-hover:text-accentLime transition-colors">{title}</h3>
                    <span className="shrink-0 text-textMuted/50 group-hover:text-accentLime/50 transition-colors">↗</span>
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
        </div>
    );
}
