import { dsaRepository } from './dsa.repository';
import { ListQuery } from '@/lib/types';

export class DsaService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, difficulty, category, section, search } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (difficulty) filters.difficulty = difficulty;
        if (category) filters.category = category;
        if (section) filters.section = section;
        if (search) filters.title = { $regex: search, $options: 'i' };

        const [data, total] = await dsaRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await dsaRepository.findById(id);
        if (!doc) throw { status: 404, message: 'DSA question not found' };
        return doc;
    }

    async getCategories() {
        return dsaRepository.findDistinct('category');
    }

    async getSections() {
        return dsaRepository.findDistinct('section');
    }
}

export const dsaService = new DsaService();
