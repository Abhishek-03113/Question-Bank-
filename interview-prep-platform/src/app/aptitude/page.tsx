'use client';

import ResourcePage from '@/components/ResourcePage';

export default function AptitudePage() {
    return (
        <ResourcePage
            title="Aptitude Questions"
            icon="🧮"
            apiEndpoint="/api/v1/aptitude"
            domain="aptitude"
            titleField="question"
            descriptionField="short_description"
            showDifficulty
            showCategory
            showSection
            categoriesEndpoint="/api/v1/aptitude/categories"
            sectionsEndpoint="/api/v1/aptitude/sections"
        />
    );
}
