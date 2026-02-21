import { NextRequest } from 'next/server';
import { gamificationController } from '@/domains/gamification/gamification.controller';

export async function GET(request: NextRequest) {
    return gamificationController.handleGetProgress(request);
}
