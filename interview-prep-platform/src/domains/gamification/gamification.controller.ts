import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from './gamification.service';
import { ApiResponse } from '@/lib/api-response';

function getUserId(request: NextRequest): string | null {
    return request.headers.get('X-User-Id') || null;
}

export class GamificationController {
    async handleGetProfile(request: NextRequest): Promise<NextResponse> {
        try {
            const userId = getUserId(request);
            if (!userId) return ApiResponse.error('Missing X-User-Id header', 400);

            const profile = await gamificationService.getProfile(userId);
            return ApiResponse.success(profile);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }

    async handlePostActivity(request: NextRequest): Promise<NextResponse> {
        try {
            const userId = getUserId(request);
            if (!userId) return ApiResponse.error('Missing X-User-Id header', 400);

            const body = await request.json();
            const { questionId, domain, action } = body as {
                questionId?: string;
                domain?: string;
                action?: string;
            };

            if (!questionId || !domain || !action) {
                return ApiResponse.error('Missing required fields: questionId, domain, action', 400);
            }
            if (action !== 'viewed' && action !== 'done') {
                return ApiResponse.error('action must be "viewed" or "done"', 400);
            }

            const profile = await gamificationService.recordActivity(userId, questionId, domain, action);
            return ApiResponse.success(profile);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }

    async handleGetProgress(request: NextRequest): Promise<NextResponse> {
        try {
            const userId = getUserId(request);
            if (!userId) return ApiResponse.error('Missing X-User-Id header', 400);

            const { searchParams } = new URL(request.url);
            const domain = searchParams.get('domain') || undefined;

            const progress = await gamificationService.getProgress(userId, domain);
            return ApiResponse.success(progress);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }

    async handleGetBadges(request: NextRequest): Promise<NextResponse> {
        try {
            const userId = getUserId(request);
            if (!userId) return ApiResponse.error('Missing X-User-Id header', 400);

            const badges = await gamificationService.getBadges(userId);
            return ApiResponse.success(badges);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }
}

export const gamificationController = new GamificationController();
