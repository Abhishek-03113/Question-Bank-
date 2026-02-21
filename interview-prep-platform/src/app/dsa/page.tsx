'use client';

import ResourcePage from '@/components/ResourcePage';

function DsaModalContent({ item }: { item: Record<string, unknown> }) {
    return (
        <div className="space-y-4 text-sm text-gray-700">
            {!!item.description && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Description</p>
                    <p className="leading-relaxed">{item.description as string}</p>
                </div>
            )}
            {!!item.short_answer && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Short Answer</p>
                    <p className="leading-relaxed">{item.short_answer as string}</p>
                </div>
            )}
            {!!item.python_code && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Python Code</p>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{item.python_code as string}</pre>
                </div>
            )}
            {!!item.java_code && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Java Code</p>
                    <pre className="bg-gray-900 text-yellow-300 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{item.java_code as string}</pre>
                </div>
            )}
            {!!item.solution_link && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Solution Link</p>
                    <a href={item.solution_link as string} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{item.solution_link as string}</a>
                </div>
            )}
            {Array.isArray(item.tags) && (item.tags as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {(item.tags as string[]).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DsaPage() {
    return (
        <ResourcePage
            title="DSA Questions"
            icon="🌲"
            apiEndpoint="/api/v1/dsa"
            titleField="title"
            descriptionField="description"
            showDifficulty
            showCategory
            showSection
            categoriesEndpoint="/api/v1/dsa/categories"
            sectionsEndpoint="/api/v1/dsa/sections"
            getCardProps={(item) => ({
                title: item.title,
                description: item.description,
                difficulty: item.difficulty,
                category: item.category,
                section: item.section,
                tags: item.tags || [],
            })}
            renderModalContent={(item) => <DsaModalContent item={item} />}
        />
    );
}
