'use client';

import ResourcePage from '@/components/ResourcePage';

export default function DsaPage() {
    return (
        <ResourcePage
            title="DSA Questions"
            icon="🌲"
            apiEndpoint="/api/v1/dsa"
            domain="dsa"
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
        />
    );
}
