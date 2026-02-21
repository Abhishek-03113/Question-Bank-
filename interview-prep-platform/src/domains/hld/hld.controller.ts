import { NextRequest, NextResponse } from 'next/server';
import { hldService } from './hld.service';
import { ApiResponse, PaginationMeta } from '@/lib/api-response';

function parseIntParam(value: string | null, fallback: number): number | null {
    if (!value) return fallback;
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
}

export class HldController {
    async handleList(request: NextRequest): Promise<NextResponse> {
        try {
            const { searchParams } = new URL(request.url);
            const page = parseIntParam(searchParams.get('page'), 1);
            const limit = parseIntParam(searchParams.get('limit'), 20);
            if (page === null || limit === null) return ApiResponse.error('Invalid page or limit parameter', 400);

            const result = await hldService.getAll({
                page,
                limit,
                difficulty: searchParams.get('difficulty') || undefined,
                section: searchParams.get('section') || undefined,
                search: searchParams.get('search') || undefined,
            });

            const pagination: PaginationMeta = {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / result.limit),
            };

            return ApiResponse.success(result.data, pagination);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }

    async handleGetById(_req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
        try {
            const id = parseInt(params.id, 10);
            if (isNaN(id)) return ApiResponse.error('Invalid ID', 400);
            const data = await hldService.getById(id);
            return ApiResponse.success(data);
        } catch (err: unknown) {
            const e = err as { status?: number; message?: string };
            return ApiResponse.error(e.message || 'Internal server error', e.status || 500);
        }
    }
}

export const hldController = new HldController();
