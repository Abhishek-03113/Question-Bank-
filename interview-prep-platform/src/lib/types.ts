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
