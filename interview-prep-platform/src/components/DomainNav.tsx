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
        <div className="flex flex-wrap gap-3 mb-8">
            {DOMAINS.map((d) => (
                <Link
                    key={d.key}
                    href={`/interview-questions/${d.key}`}
                    className={`px-5 py-2 rounded-full font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${activeDomain === d.key
                        ? 'bg-accentLime/10 border-accentLime/50 text-accentLime shadow-[0_0_15px_rgba(204,255,0,0.1)]'
                        : 'bg-surface border-border/80 text-textMuted hover:text-accentLime hover:border-accentLime/50'
                        }`}
                >
                    {d.label}
                </Link>
            ))}
        </div>
    );
}
