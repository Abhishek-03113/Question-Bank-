import { connectDB } from '@/lib/mongodb';
import HldQuestion from './hld.model';

export class HldRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            HldQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            HldQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return HldQuestion.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return HldQuestion.distinct(field);
    }
}

export const hldRepository = new HldRepository();
