'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GamificationProfile, QuestionActivity } from '@/lib/types';

const USER_ID_KEY = 'gamification_user_id';
const PENDING_QUEUE_KEY = 'gamification_pending_queue';
const QUEUE_CAP = 200;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateUserId(): string {
    // Generate a UUID v4
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getOrCreateUserId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
        id = generateUserId();
        localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
}

function readQueue(): QuestionActivity[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(PENDING_QUEUE_KEY) || '[]');
    } catch {
        return [];
    }
}

function writeQueue(queue: QuestionActivity[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue.slice(0, QUEUE_CAP)));
}

function enqueueActivity(activity: QuestionActivity): void {
    const queue = readQueue();
    // Avoid capping at 200 — deduplicate by (questionId, domain, action)
    const exists = queue.some(
        (q) => q.questionId === activity.questionId && q.domain === activity.domain && q.action === activity.action
    );
    if (!exists) {
        queue.push(activity);
        writeQueue(queue);
    }
}

function dequeueActivity(activity: QuestionActivity): void {
    const queue = readQueue().filter(
        (q) => !(q.questionId === activity.questionId && q.domain === activity.domain && q.action === activity.action)
    );
    writeQueue(queue);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseGamificationResult {
    profile: GamificationProfile | null;
    userId: string;
    loading: boolean;
    recordActivity: (questionId: string, domain: string, action: 'viewed' | 'done') => Promise<void>;
    isDone: (questionId: string) => boolean;
    isViewed: (questionId: string) => boolean;
}

export function useGamification(): UseGamificationResult {
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    // Local sets for optimistic state — keyed by questionId
    const doneSet = useRef<Set<string>>(new Set());
    const viewedSet = useRef<Set<string>>(new Set());

    // ─── Fetch profile ───────────────────────────────────────────────────────
    const fetchProfile = useCallback(async (uid: string) => {
        if (!uid) return;
        try {
            const res = await fetch('/api/v1/gamification/profile', {
                headers: { 'X-User-Id': uid },
            });
            if (res.ok) {
                const json = await res.json();
                setProfile(json.data);
            }
        } catch {
            // network failure — keep current profile
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Send a single activity to the API ───────────────────────────────────
    const sendActivity = useCallback(
        async (uid: string, activity: QuestionActivity): Promise<boolean> => {
            try {
                const res = await fetch('/api/v1/gamification/activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': uid,
                    },
                    body: JSON.stringify(activity),
                });
                if (res.ok) {
                    const json = await res.json();
                    setProfile(json.data);
                    return true;
                }
            } catch {
                // network failure
            }
            return false;
        },
        []
    );

    // ─── Drain the pending queue ──────────────────────────────────────────────
    const drainQueue = useCallback(
        async (uid: string) => {
            const queue = readQueue();
            if (queue.length === 0) return;
            for (const activity of queue) {
                const ok = await sendActivity(uid, activity);
                if (ok) dequeueActivity(activity);
            }
        },
        [sendActivity]
    );

    // ─── Init on mount ───────────────────────────────────────────────────────
    useEffect(() => {
        const uid = getOrCreateUserId();
        setUserId(uid);
        void fetchProfile(uid);
        void drainQueue(uid);
    }, [fetchProfile, drainQueue]);

    // ─── Drain queue on window focus ─────────────────────────────────────────
    useEffect(() => {
        if (!userId) return;
        const onFocus = () => void drainQueue(userId);
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [userId, drainQueue]);

    // ─── recordActivity ───────────────────────────────────────────────────────
    const recordActivity = useCallback(
        async (questionId: string, domain: string, action: 'viewed' | 'done') => {
            if (!userId) return;

            const activity: QuestionActivity = { questionId, domain, action };

            // Optimistic update
            if (action === 'viewed') viewedSet.current.add(questionId);
            if (action === 'done') {
                doneSet.current.add(questionId);
                viewedSet.current.add(questionId);
            }

            // Enqueue before sending (ensures no-loss on failure)
            enqueueActivity(activity);

            const ok = await sendActivity(userId, activity);
            if (ok) dequeueActivity(activity);
        },
        [userId, sendActivity]
    );

    // ─── State checkers ───────────────────────────────────────────────────────
    const isDone = useCallback((questionId: string) => doneSet.current.has(questionId), []);
    const isViewed = useCallback((questionId: string) => viewedSet.current.has(questionId), []);

    return { profile, userId, loading, recordActivity, isDone, isViewed };
}
