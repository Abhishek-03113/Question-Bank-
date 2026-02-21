import { NextRequest } from 'next/server';
import { gamificationController } from '@/domains/gamification/gamification.controller';

export async function POST(request: NextRequest) {
    return gamificationController.handlePostActivity(request);
}
