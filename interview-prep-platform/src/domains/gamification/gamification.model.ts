import mongoose, { Schema, Document } from 'mongoose';

// ─── GamificationProfile ─────────────────────────────────────────────────────

export interface IGamificationProfile extends Document {
    userId: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
    totalViewed: number;
    totalDone: number;
    badges: { id: string; name: string; earnedAt: string }[];
    domainProgress: Record<string, { viewed: number; done: number }>;
    createdAt: Date;
    updatedAt: Date;
}

const DomainProgressSchema = new Schema(
    { viewed: { type: Number, default: 0 }, done: { type: Number, default: 0 } },
    { _id: false }
);

const BadgeSchema = new Schema(
    { id: { type: String }, name: { type: String }, earnedAt: { type: String } },
    { _id: false }
);

const GamificationProfileSchema = new Schema<IGamificationProfile>(
    {
        userId: { type: String, required: true, unique: true, index: true },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastStudyDate: { type: String, default: '' },
        totalViewed: { type: Number, default: 0 },
        totalDone: { type: Number, default: 0 },
        badges: { type: [BadgeSchema], default: [] },
        domainProgress: {
            type: {
                dsa: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                sql: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                hld: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                lld: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                aptitude: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                csFundamentals: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                interviewQuestions: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                jobPortals: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
                coldDms: { type: DomainProgressSchema, default: () => ({ viewed: 0, done: 0 }) },
            },
            default: () => ({
                dsa: { viewed: 0, done: 0 },
                sql: { viewed: 0, done: 0 },
                hld: { viewed: 0, done: 0 },
                lld: { viewed: 0, done: 0 },
                aptitude: { viewed: 0, done: 0 },
                csFundamentals: { viewed: 0, done: 0 },
                interviewQuestions: { viewed: 0, done: 0 },
                jobPortals: { viewed: 0, done: 0 },
                coldDms: { viewed: 0, done: 0 },
            }),
        },
    },
    { timestamps: true }
);

export const GamificationProfileModel =
    mongoose.models.GamificationProfile ||
    mongoose.model<IGamificationProfile>(
        'GamificationProfile',
        GamificationProfileSchema,
        'gamification_profiles'
    );

// ─── QuestionProgress ────────────────────────────────────────────────────────

export interface IQuestionProgress extends Document {
    userId: string;
    questionId: string;
    domain: string;
    status: 'viewed' | 'done';
    viewedAt: Date;
    doneAt: Date | null;
    updatedAt: Date;
}

const QuestionProgressSchema = new Schema<IQuestionProgress>(
    {
        userId: { type: String, required: true, index: true },
        questionId: { type: String, required: true },
        domain: { type: String, required: true },
        status: { type: String, enum: ['viewed', 'done'], default: 'viewed' },
        viewedAt: { type: Date, default: () => new Date() },
        doneAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Compound unique index — idempotent upserts
QuestionProgressSchema.index({ userId: 1, questionId: 1, domain: 1 }, { unique: true });

export const QuestionProgressModel =
    mongoose.models.QuestionProgress ||
    mongoose.model<IQuestionProgress>(
        'QuestionProgress',
        QuestionProgressSchema,
        'question_progress'
    );
