'use client';

import Link from 'next/link';

const DOMAINS = [
    { key: 'ai', label: 'AI' },
    { key: 'backend', label: 'Backend' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'general', label: 'General' },
    { key: 'java', label: 'Java' },
    { key: 'system_design', label: 'System Design' },
    { key: 'data_analyst', label: 'Data Analyst' },
];

interface DomainNavProps {
    activeDomain: string;
}

export default function DomainNav({ activeDomain }: DomainNavProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {DOMAINS.map((d) => (
                <Link
                    key={d.key}
                    href={`/interview-questions/${d.key}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDomain === d.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {d.label}
                </Link>
            ))}
        </div>
    );
}
