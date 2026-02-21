'use client';

import ResourcePage from '@/components/ResourcePage';

export default function CsFundamentalsPage() {
    return (
        <ResourcePage
            title="CS Fundamentals"
            icon="💻"
            apiEndpoint="/api/v1/cs-fundamentals"
            titleField="question"
            showDifficulty
            showCategory
            categoriesEndpoint="/api/v1/cs-fundamentals/categories"
        />
    );
}
