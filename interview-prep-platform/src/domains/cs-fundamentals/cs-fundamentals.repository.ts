import { connectDB } from '@/lib/mongodb';
import CsFundamental from './cs-fundamentals.model';

export class CsFundamentalsRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            CsFundamental.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            CsFundamental.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return CsFundamental.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return CsFundamental.distinct(field);
    }
}

export const csFundamentalsRepository = new CsFundamentalsRepository();
