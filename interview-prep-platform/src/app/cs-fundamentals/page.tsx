'use client';

import ResourcePage from '@/components/ResourcePage';

export default function CsFundamentalsPage() {
    return (
        <ResourcePage
            title="CS Fundamentals"
            icon="💻"
            apiEndpoint="/api/v1/cs-fundamentals"
            titleField="cs_question"
            showDifficulty
            showCategory
            categoriesEndpoint="/api/v1/cs-fundamentals/categories"
            getCardProps={(item) => ({
                title: item.cs_question,
                difficulty: item.cs_difficulty,
                category: item.cs_category,
                section: item.cs_section,
            })}
        />
    );
}
