import { connectDB } from '@/lib/mongodb';
import DsaQuestion from './dsa.model';

export class DsaRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            DsaQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            DsaQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return DsaQuestion.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return DsaQuestion.distinct(field);
    }
}

export const dsaRepository = new DsaRepository();
