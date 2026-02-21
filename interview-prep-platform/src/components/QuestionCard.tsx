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
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-orange-100 text-orange-800',
    hard: 'bg-red-100 text-red-800',
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-orange-100 text-orange-800',
    Hard: 'bg-red-100 text-red-800',
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
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3 flex justify-between items-start gap-4 hover:border-blue-300 transition-colors">
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h3>
                {description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {difficulty && (
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyClasses[difficulty] || 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {difficulty}
                        </span>
                    )}
                    {category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {category}
                        </span>
                    )}
                    {section && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {section}
                        </span>
                    )}
                    {tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <button
                onClick={onView}
                className="shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
            >
                View
            </button>
        </div>
    );
}
