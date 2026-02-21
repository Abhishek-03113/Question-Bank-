import { sqlRepository } from './sql.repository';
import { ListQuery } from '@/lib/types';

export class SqlService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, difficulty, category, search, type } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (difficulty) filters.difficulty = difficulty;
        if (category) filters.category = category;
        if (type) filters.type = type;
        if (search) filters.question = { $regex: search, $options: 'i' };

        const [data, total] = await sqlRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await sqlRepository.findById(id);
        if (!doc) throw { status: 404, message: 'SQL question not found' };
        return doc;
    }

    async getCategories() {
        return sqlRepository.findDistinct('category');
    }
}

export const sqlService = new SqlService();
