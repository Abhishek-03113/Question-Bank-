import { coldDmsRepository } from './cold-dms.repository';
import { ListQuery } from '@/lib/types';

export class ColdDmsService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, category, search } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (category) filters.Category = category;
        if (search) filters.Title = { $regex: search, $options: 'i' };

        const [data, total] = await coldDmsRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getById(id: string) {
        const doc = await coldDmsRepository.findById(id);
        if (!doc) throw { status: 404, message: 'Cold DM template not found' };
        return doc;
    }

    async getCategories() {
        return coldDmsRepository.findDistinct('Category');
    }
}

export const coldDmsService = new ColdDmsService();
