'use client';

import ResourcePage from '@/components/ResourcePage';

export default function LldPage() {
    return (
        <ResourcePage
            title="LLD Questions"
            icon="🔧"
            apiEndpoint="/api/v1/lld"
            titleField="question"
            showDifficulty
            showSection
        />
    );
}
