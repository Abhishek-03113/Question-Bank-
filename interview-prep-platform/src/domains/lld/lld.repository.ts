import { connectDB } from '@/lib/mongodb';
import LldQuestion from './lld.model';

export class LldRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            LldQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            LldQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return LldQuestion.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return LldQuestion.distinct(field);
    }
}

export const lldRepository = new LldRepository();
