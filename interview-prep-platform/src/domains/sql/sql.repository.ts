import { connectDB } from '@/lib/mongodb';
import SqlQuestion from './sql.model';

export class SqlRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            SqlQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            SqlQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return SqlQuestion.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return SqlQuestion.distinct(field);
    }
}

export const sqlRepository = new SqlRepository();
