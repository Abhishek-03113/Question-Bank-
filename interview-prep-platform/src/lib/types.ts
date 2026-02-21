export interface ListQuery {
    page?: number;
    limit?: number;
    difficulty?: string;
    category?: string;
    section?: string;
    search?: string;
    domain?: string;
    type?: string;
    is_premium?: boolean;
}

// ─── Gamification Types ───────────────────────────────────────────────────────

export interface Badge {
    id: string;
    name: string;
    earnedAt: string; // ISO date string
}

export interface DomainProgressEntry {
    viewed: number;
    done: number;
}

export interface GamificationProfile {
    userId: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string; // "YYYY-MM-DD"
    totalViewed: number;
    totalDone: number;
    badges: Badge[];
    domainProgress: {
        dsa: DomainProgressEntry;
        sql: DomainProgressEntry;
        hld: DomainProgressEntry;
        lld: DomainProgressEntry;
        aptitude: DomainProgressEntry;
        csFundamentals: DomainProgressEntry;
        interviewQuestions: DomainProgressEntry;
        jobPortals: DomainProgressEntry;
        coldDms: DomainProgressEntry;
    };
}

export interface QuestionActivity {
    questionId: string;
    domain: string;
    action: 'viewed' | 'done';
}
