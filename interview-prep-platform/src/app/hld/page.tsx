'use client';

import ResourcePage from '@/components/ResourcePage';

function HldModalContent({ item }: { item: Record<string, unknown> }) {
    return (
        <div className="space-y-4 text-sm text-gray-700">
            {!!item.answer && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Answer</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{item.answer as string}</p>
                </div>
            )}
            {!!item.explanation && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Explanation</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{item.explanation as string}</p>
                </div>
            )}
            {!!item.examples && (
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Examples</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{item.examples as string}</p>
                </div>
            )}
        </div>
    );
}

export default function HldPage() {
    return (
        <ResourcePage
            title="HLD Questions"
            icon="🏗️"
            apiEndpoint="/api/v1/hld"
            domain="hld"
            titleField="question"
            showDifficulty
            showSection
            renderModalContent={(item) => <HldModalContent item={item} />}
        />
    );
}
