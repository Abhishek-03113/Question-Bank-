import { connectDB } from '@/lib/mongodb';
import { GamificationProfileModel, QuestionProgressModel } from './gamification.model';
import { GamificationProfile } from '@/lib/types';

const DOMAINS = ['dsa', 'sql', 'hld', 'lld', 'aptitude', 'csFundamentals', 'interviewQuestions', 'jobPortals', 'coldDms'];

function defaultProfile(userId: string): Partial<GamificationProfile> {
    const domainProgress = Object.fromEntries(
        DOMAINS.map((d) => [d, { viewed: 0, done: 0 }])
    ) as GamificationProfile['domainProgress'];

    return {
        userId,
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: '',
        totalViewed: 0,
        totalDone: 0,
        badges: [],
        domainProgress,
    };
}

export class GamificationRepository {
    async findOrCreateProfile(userId: string): Promise<GamificationProfile> {
        await connectDB();
        const doc = await GamificationProfileModel.findOneAndUpdate(
            { userId },
            { $setOnInsert: defaultProfile(userId) },
            { upsert: true, new: true, lean: true }
        );
        return doc as unknown as GamificationProfile;
    }

    /**
     * Atomically increment/set fields on the gamification profile.
     * `inc` fields are applied with $inc, `set` fields with $set.
     */
    async updateProfile(
        userId: string,
        inc: Record<string, number>,
        set: Record<string, unknown>
    ): Promise<GamificationProfile> {
        await connectDB();
        const update: Record<string, unknown> = {};
        if (Object.keys(inc).length > 0) update.$inc = inc;
        if (Object.keys(set).length > 0) update.$set = set;

        const doc = await GamificationProfileModel.findOneAndUpdate(
            { userId },
            update,
            { new: true, lean: true, upsert: true }
        );
        return doc as unknown as GamificationProfile;
    }

    /**
     * Upsert a question progress record. Returns { isNew, wasViewed } flags.
     */
    async upsertQuestionProgress(
        userId: string,
        questionId: string,
        domain: string,
        action: 'viewed' | 'done'
    ): Promise<{ isNew: boolean; wasViewed: boolean; wasDone: boolean }> {
        await connectDB();

        // Try to find the existing record
        const existing = await QuestionProgressModel.findOne({ userId, questionId, domain }).lean();

        if (!existing) {
            // Brand new record
            await QuestionProgressModel.create({
                userId,
                questionId,
                domain,
                status: action,
                viewedAt: new Date(),
                doneAt: action === 'done' ? new Date() : null,
            });
            return { isNew: true, wasViewed: false, wasDone: false };
        }

        const wasDone = existing.status === 'done';
        const wasViewed = existing.status === 'viewed';

        if (wasDone) {
            // Already at terminal state — idempotent, nothing to do
            return { isNew: false, wasViewed: false, wasDone: true };
        }

        if (wasViewed && action === 'done') {
            // Upgrade viewed → done
            await QuestionProgressModel.updateOne(
                { userId, questionId, domain },
                { $set: { status: 'done', doneAt: new Date() } }
            );
            return { isNew: false, wasViewed: true, wasDone: false };
        }

        // viewed → viewed: idempotent
        return { isNew: false, wasViewed: false, wasDone: false };
    }

    async getProgressByDomain(
        userId: string,
        domain?: string
    ): Promise<Record<string, { viewed: number; done: number }>> {
        await connectDB();
        const match: Record<string, unknown> = { userId };
        if (domain) match.domain = domain;

        const results = await QuestionProgressModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$domain',
                    viewed: { $sum: { $cond: [{ $in: ['$status', ['viewed', 'done']] }, 1, 0] } },
                    done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
                },
            },
        ]);

        return Object.fromEntries(results.map((r) => [r._id, { viewed: r.viewed, done: r.done }]));
    }

    async getBadges(userId: string): Promise<GamificationProfile['badges']> {
        await connectDB();
        const doc = await GamificationProfileModel.findOne({ userId }).select('badges').lean();
        if (!doc) return [];
        return (doc as unknown as GamificationProfile).badges || [];
    }
}

export const gamificationRepository = new GamificationRepository();
