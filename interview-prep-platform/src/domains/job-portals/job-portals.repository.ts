import { connectDB } from '@/lib/mongodb';
import JobPortal from './job-portals.model';

export class JobPortalsRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            JobPortal.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            JobPortal.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number): Promise<unknown> {
        await connectDB();
        return JobPortal.findOne({ id }).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return JobPortal.distinct(field);
    }
}

export const jobPortalsRepository = new JobPortalsRepository();
