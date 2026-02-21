import { connectDB } from '@/lib/mongodb';
import ColdDm from './cold-dms.model';

export class ColdDmsRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            ColdDm.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            ColdDm.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: string): Promise<unknown> {
        await connectDB();
        return ColdDm.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return ColdDm.distinct(field);
    }
}

export const coldDmsRepository = new ColdDmsRepository();
