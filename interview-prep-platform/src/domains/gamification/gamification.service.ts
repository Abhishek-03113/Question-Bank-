import { gamificationRepository } from './gamification.repository';
import { GamificationProfile, Badge } from '@/lib/types';

// ─── XP Level Thresholds ──────────────────────────────────────────────────────

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export function computeLevel(xp: number): number {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
}

export function xpForNextLevel(level: number): number {
    return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

// ─── Badge Catalogue ─────────────────────────────────────────────────────────

const BADGE_CATALOGUE: { id: string; name: string; check: (p: GamificationProfile) => boolean }[] = [
    { id: 'first_question', name: 'First Step', check: (p) => p.totalViewed >= 1 },
    { id: 'streak_3', name: 'On a Roll', check: (p) => p.currentStreak >= 3 },
    { id: 'streak_7', name: 'Week Warrior', check: (p) => p.currentStreak >= 7 },
    { id: 'streak_30', name: 'Month Master', check: (p) => p.currentStreak >= 30 },
    { id: 'done_10', name: 'Getting Started', check: (p) => p.totalDone >= 10 },
    { id: 'done_50', name: 'Halfway There', check: (p) => p.totalDone >= 50 },
    { id: 'done_100', name: 'Century Club', check: (p) => p.totalDone >= 100 },
    { id: 'done_250', name: 'Elite Prep', check: (p) => p.totalDone >= 250 },
    { id: 'level_5', name: 'Mid-Level', check: (p) => p.level >= 5 },
    { id: 'level_10', name: 'Expert', check: (p) => p.level >= 10 },
];

function evaluateNewBadges(profile: GamificationProfile): Badge[] {
    const earnedIds = new Set((profile.badges || []).map((b) => b.id));
    const newBadges: Badge[] = [];

    for (const badge of BADGE_CATALOGUE) {
        if (!earnedIds.has(badge.id) && badge.check(profile)) {
            newBadges.push({ id: badge.id, name: badge.name, earnedAt: new Date().toISOString() });
        }
    }
    return newBadges;
}

// ─── Streak Logic ─────────────────────────────────────────────────────────────

function computeStreakDelta(
    lastStudyDate: string,
    today: string
): { streakDelta: number; resetStreak: number | null } {
    if (!lastStudyDate || lastStudyDate === '') {
        return { streakDelta: 1, resetStreak: null }; // first ever activity
    }

    if (lastStudyDate === today) {
        return { streakDelta: 0, resetStreak: null }; // already studied today
    }

    const last = new Date(lastStudyDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return { streakDelta: 1, resetStreak: null }; // consecutive day
    }

    return { streakDelta: 0, resetStreak: 1 }; // missed a day — reset
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class GamificationService {
    async getProfile(userId: string): Promise<GamificationProfile> {
        return gamificationRepository.findOrCreateProfile(userId);
    }

    async recordActivity(
        userId: string,
        questionId: string,
        domain: string,
        action: 'viewed' | 'done'
    ): Promise<GamificationProfile> {
        // 1. Upsert question progress and get change flags
        const { isNew, wasViewed, wasDone } = await gamificationRepository.upsertQuestionProgress(
            userId,
            questionId,
            domain,
            action
        );

        // 2. Compute XP delta
        let xpDelta = 0;
        let viewedDelta = 0;
        let doneDelta = 0;

        if (isNew && action === 'viewed') {
            xpDelta = 2;
            viewedDelta = 1;
        } else if (isNew && action === 'done') {
            xpDelta = 5; // direct done (no prior view)
            viewedDelta = 1;
            doneDelta = 1;
        } else if (wasViewed && action === 'done') {
            xpDelta = 3; // bonus for upgrading viewed → done
            doneDelta = 1;
        } else if (wasDone) {
            // Idempotent — no-op
            return gamificationRepository.findOrCreateProfile(userId);
        }

        // 3. Fetch current profile to compute streaks / levels / badges
        const current = await gamificationRepository.findOrCreateProfile(userId);

        const today = new Date().toISOString().slice(0, 10);
        const { streakDelta, resetStreak } = computeStreakDelta(current.lastStudyDate, today);

        const newXp = current.xp + xpDelta;
        const newLevel = computeLevel(newXp);
        const newCurrentStreak = resetStreak !== null ? resetStreak : current.currentStreak + streakDelta;
        const newLongestStreak = Math.max(current.longestStreak, newCurrentStreak);

        // 4. Build $inc and $set maps
        const inc: Record<string, number> = {};
        const set: Record<string, unknown> = {
            level: newLevel,
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastStudyDate: today,
        };

        if (xpDelta > 0) inc.xp = xpDelta;
        if (viewedDelta > 0) {
            inc.totalViewed = viewedDelta;
            inc[`domainProgress.${domain}.viewed`] = viewedDelta;
        }
        if (doneDelta > 0) {
            inc.totalDone = doneDelta;
            inc[`domainProgress.${domain}.done`] = doneDelta;
        }

        // 5. Atomically update profile
        let updated = await gamificationRepository.updateProfile(userId, inc, set);

        // 6. Evaluate badges on the updated profile snapshot
        const newBadges = evaluateNewBadges(updated);
        if (newBadges.length > 0) {
            const allBadges = [...(updated.badges || []), ...newBadges];
            updated = await gamificationRepository.updateProfile(userId, {}, { badges: allBadges });
        }

        return updated;
    }

    async getProgress(
        userId: string,
        domain?: string
    ): Promise<Record<string, { viewed: number; done: number }>> {
        return gamificationRepository.getProgressByDomain(userId, domain);
    }

    async getBadges(userId: string): Promise<GamificationProfile['badges']> {
        return gamificationRepository.getBadges(userId);
    }
}

export const gamificationService = new GamificationService();
