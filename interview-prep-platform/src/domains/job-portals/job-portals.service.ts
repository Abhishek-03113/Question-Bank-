import { jobPortalsRepository } from './job-portals.repository';
import { ListQuery } from '@/lib/types';

export class JobPortalsService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, category, search, is_premium } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (category) filters.category = category;
        if (is_premium !== undefined) filters.is_premium = is_premium;
        if (search) filters.name = { $regex: search, $options: 'i' };

        const [data, total] = await jobPortalsRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: number) {
        const doc = await jobPortalsRepository.findById(id);
        if (!doc) throw { status: 404, message: 'Job portal not found' };
        return doc;
    }

    async getCategories() {
        return jobPortalsRepository.findDistinct('category');
    }
}

export const jobPortalsService = new JobPortalsService();
