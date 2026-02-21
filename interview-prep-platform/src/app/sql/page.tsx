'use client';

import ResourcePage from '@/components/ResourcePage';

export default function SqlPage() {
    return (
        <ResourcePage
            title="SQL Questions"
            icon="🗄️"
            apiEndpoint="/api/v1/sql"
            domain="sql"
            titleField="question"
            showDifficulty
            showCategory
            categoriesEndpoint="/api/v1/sql/categories"
            extraFilters={(filters, setFilters) => (
                <select
                    value={filters.type || ''}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                    <option value="">All Types</option>
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                </select>
            )}
        />
    );
}
