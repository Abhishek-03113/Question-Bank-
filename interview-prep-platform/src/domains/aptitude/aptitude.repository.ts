import { connectDB } from '@/lib/mongodb';
import AptitudeQuestion from './aptitude.model';

export class AptitudeRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            AptitudeQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            AptitudeQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return AptitudeQuestion.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return AptitudeQuestion.distinct(field);
    }
}

export const aptitudeRepository = new AptitudeRepository();
