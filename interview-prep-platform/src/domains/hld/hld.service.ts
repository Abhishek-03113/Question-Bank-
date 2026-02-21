import { hldRepository } from './hld.repository';
import { ListQuery } from '@/lib/types';

export class HldService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, difficulty, section, search } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (difficulty) filters.difficulty = difficulty;
        if (section) filters.section = section;
        if (search) filters.question = { $regex: search, $options: 'i' };

        const [data, total] = await hldRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await hldRepository.findById(id);
        if (!doc) throw { status: 404, message: 'HLD question not found' };
        return doc;
    }
}

export const hldService = new HldService();
