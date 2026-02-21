'use client';

import { GamificationProfile } from '@/lib/types';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

function xpForLevel(level: number): number {
    return LEVEL_THRESHOLDS[level - 1] ?? 0;
}

function xpForNextLevel(level: number): number {
    return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function xpProgressPercent(xp: number, level: number): number {
    const current = xpForLevel(level);
    const next = xpForNextLevel(level);
    if (next === current) return 100;
    return Math.min(100, Math.round(((xp - current) / (next - current)) * 100));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBar() {
    return (
        <div className="bg-surface border border-border rounded-lg px-4 py-2.5 flex items-center gap-5">
            <div className="w-12 h-10 bg-border rounded animate-pulse" />
            <div className="w-px h-7 bg-border" />
            <div className="w-14 h-6 bg-border rounded animate-pulse" />
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-2 w-24 bg-border rounded animate-pulse" />
                <div className="h-1.5 w-full bg-border rounded animate-pulse" />
            </div>
            <div className="w-px h-7 bg-border" />
            <div className="w-10 h-8 bg-border rounded animate-pulse" />
        </div>
    );
}

// ─── Bar ─────────────────────────────────────────────────────────────────────

interface GamificationBarProps {
    profile: GamificationProfile | null;
    loading?: boolean;
    domain?: string;
}

export default function GamificationBar({ profile, loading = false, domain }: GamificationBarProps) {
    if (loading || !profile) return <SkeletonBar />;

    const { xp, level, currentStreak, totalDone, totalViewed, domainProgress } = profile;
    const percent = xpProgressPercent(xp, level);
    const nextXp = xpForNextLevel(level);

    // If domain is specified, show domain-specific counts; else show global counts
    const doneCount = domain
        ? (domainProgress[domain as keyof typeof domainProgress]?.done ?? totalDone)
        : totalDone;
    const viewedCount = domain
        ? (domainProgress[domain as keyof typeof domainProgress]?.viewed ?? totalViewed)
        : totalViewed;

    return (
        <div className="bg-surface border border-border rounded-lg px-4 py-2.5 flex items-center gap-5 flex-wrap">
            {/* Streak */}
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg" aria-hidden>🔥</span>
                <div>
                    <div className="text-xl font-sans font-black text-textPrimary leading-none">{currentStreak}</div>
                    <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-0.5">
                        Day Streak
                    </div>
                </div>
            </div>

            <div className="w-px h-7 bg-border shrink-0" />

            {/* Level pill */}
            <div className="bg-accentLime text-[#000] font-mono text-[10px] font-black px-2.5 py-1 rounded tracking-widest uppercase shrink-0">
                LVL {level}
            </div>

            {/* XP bar */}
            <div className="flex-1 min-w-[120px] flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted">
                        XP Progress
                    </span>
                    <span className="font-mono text-[9px] text-textMuted">{xp} / {nextXp} XP</span>
                </div>
                <div className="bg-border rounded h-[5px] w-full overflow-hidden">
                    <div
                        className="bg-accentLime rounded h-[5px] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <div className="w-px h-7 bg-border shrink-0" />

            {/* Done count */}
            <div className="text-center shrink-0">
                <div className="text-base font-sans font-black text-accentLime leading-none">{doneCount}</div>
                <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-0.5">Done</div>
            </div>

            {/* Viewed count */}
            <div className="text-center shrink-0">
                <div className="text-base font-sans font-black text-textPrimary leading-none">{viewedCount}</div>
                <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-textMuted mt-0.5">Viewed</div>
            </div>
        </div>
    );
}
