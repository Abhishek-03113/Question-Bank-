'use client';

import { GamificationProfile, Badge } from '@/lib/types';

// ─── Badge catalogue (for locked badge display) ───────────────────────────────

const ALL_BADGES: { id: string; name: string; icon: string }[] = [
    { id: 'first_question', name: 'First Step', icon: '👣' },
    { id: 'streak_3', name: 'On a Roll', icon: '🔥' },
    { id: 'streak_7', name: 'Week Warrior', icon: '⚔️' },
    { id: 'streak_30', name: 'Month Master', icon: '🏆' },
    { id: 'done_10', name: 'Getting Started', icon: '🌱' },
    { id: 'done_50', name: 'Halfway There', icon: '💪' },
    { id: 'done_100', name: 'Century Club', icon: '💯' },
    { id: 'done_250', name: 'Elite Prep', icon: '🌟' },
    { id: 'level_5', name: 'Mid-Level', icon: '🎯' },
    { id: 'level_10', name: 'Expert', icon: '👑' },
];

function BadgeChip({ id, name, icon, earned }: { id: string; name: string; icon: string; earned: boolean }) {
    return (
        <div
            key={id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-mono tracking-tight transition-all
                ${earned
                    ? 'border-accentLime/50 text-accentLime bg-accentLime/5 shadow-[0_0_15px_rgba(204,255,0,0.08)]'
                    : 'border-border text-textMuted opacity-35 grayscale'
                }`}
        >
            <span className="text-base" aria-hidden>{icon}</span>
            <span>{name}</span>
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonDashboard() {
    return (
        <div className="bg-surface border border-border rounded-lg p-6">
            <div className="h-4 w-32 bg-border rounded animate-pulse mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-bgPrimary border border-border rounded-lg p-4">
                        <div className="h-7 w-12 bg-border rounded animate-pulse mb-2" />
                        <div className="h-2 w-20 bg-border rounded animate-pulse" />
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-border rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

interface GamificationDashboardProps {
    profile: GamificationProfile | null;
    loading?: boolean;
}

export default function GamificationDashboard({ profile, loading = false }: GamificationDashboardProps) {
    if (loading || !profile) return <SkeletonDashboard />;

    const { xp, currentStreak, longestStreak, totalDone, badges } = profile;
    const earnedIds = new Set((badges as Badge[]).map((b) => b.id));

    return (
        <div className="bg-surface border border-border rounded-lg p-6">
            {/* Section header */}
            <div className="font-mono text-[11px] font-bold tracking-widest uppercase text-textMuted border-b border-border/60 pb-2.5 mb-5 flex items-center gap-2">
                <span className="opacity-50">//</span>
                <span>Your Progress</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-bgPrimary border border-border rounded-lg p-4 hover:border-accentLime/40 transition-colors">
                    <div className="font-sans font-black text-2xl text-accentLime leading-tight">🔥 {currentStreak}</div>
                    <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-1.5">
                        Current Streak
                    </div>
                </div>
                <div className="bg-bgPrimary border border-border rounded-lg p-4 hover:border-accentLime/40 transition-colors">
                    <div className="font-sans font-black text-2xl text-textPrimary leading-tight">{longestStreak}</div>
                    <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-1.5">
                        Longest Streak
                    </div>
                </div>
                <div className="bg-bgPrimary border border-border rounded-lg p-4 hover:border-accentLime/40 transition-colors">
                    <div className="font-sans font-black text-2xl text-accentLime leading-tight">{xp}</div>
                    <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-1.5">
                        Total XP
                    </div>
                </div>
                <div className="bg-bgPrimary border border-border rounded-lg p-4 hover:border-accentLime/40 transition-colors">
                    <div className="font-sans font-black text-2xl text-textPrimary leading-tight">{totalDone}</div>
                    <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-1.5">
                        Questions Done
                    </div>
                </div>
            </div>

            {/* Badge shelf */}
            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-textMuted mb-3 flex items-center gap-2">
                <span className="opacity-50">//</span>
                <span>Badges Earned</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {ALL_BADGES.map((badge) => (
                    <BadgeChip
                        key={badge.id}
                        id={badge.id}
                        name={badge.name}
                        icon={badge.icon}
                        earned={earnedIds.has(badge.id)}
                    />
                ))}
            </div>
        </div>
    );
}
