import { csFundamentalsRepository } from './cs-fundamentals.repository';
import { ListQuery } from '@/lib/types';

export class CsFundamentalsService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, difficulty, category, section, search } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (difficulty) filters.difficulty = difficulty;
        if (category) filters.category = category;
        if (section) filters.section = section;
        if (search) filters.question = { $regex: search, $options: 'i' };

        const [data, total] = await csFundamentalsRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await csFundamentalsRepository.findById(id);
        if (!doc) throw { status: 404, message: 'CS Fundamentals question not found' };
        return doc;
    }

    async getCategories() {
        return csFundamentalsRepository.findDistinct('category');
    }
}

export const csFundamentalsService = new CsFundamentalsService();
