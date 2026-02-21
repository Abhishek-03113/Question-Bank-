import { aptitudeRepository } from './aptitude.repository';
import { ListQuery } from '@/lib/types';

export class AptitudeService {
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

        const [data, total] = await aptitudeRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await aptitudeRepository.findById(id);
        if (!doc) throw { status: 404, message: 'Aptitude question not found' };
        return doc;
    }

    async getCategories() {
        return aptitudeRepository.findDistinct('category');
    }

    async getSections() {
        return aptitudeRepository.findDistinct('section');
    }
}

export const aptitudeService = new AptitudeService();
