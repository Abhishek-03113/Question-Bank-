'use client';

import ResourcePage from '@/components/ResourcePage';

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
        />
    );
}
