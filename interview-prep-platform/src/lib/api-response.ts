import { NextResponse } from 'next/server';

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface SuccessResponse<T = unknown> {
    success: true;
    data: T;
    pagination?: PaginationMeta;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export class ApiResponse {
    static success<T>(data: T, pagination?: PaginationMeta): NextResponse<SuccessResponse<T>> {
        const body: SuccessResponse<T> = { success: true, data };
        if (pagination) body.pagination = pagination;
        return NextResponse.json(body, { status: 200 });
    }

    static error(message: string, status = 500): NextResponse<ErrorResponse> {
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
