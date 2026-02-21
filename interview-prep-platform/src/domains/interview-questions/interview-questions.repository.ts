import { connectDB } from '@/lib/mongodb';
import InterviewQuestion from './interview-questions.model';

export class InterviewQuestionsRepository {
    async findAll(
        filters: Record<string, unknown>,
        skip: number,
        limit: number
    ): Promise<[unknown[], number]> {
        await connectDB();
        const [docs, total] = await Promise.all([
            InterviewQuestion.find(filters).sort({ id: 1 }).skip(skip).limit(limit).lean(),
            InterviewQuestion.countDocuments(filters),
        ]);
        return [docs, total];
    }

    async findById(id: number, domain?: string): Promise<unknown> {
        await connectDB();
        const query: Record<string, unknown> = { id };
        if (domain) query.domain = domain;
        return InterviewQuestion.findOne(query).lean();
    }

    async findDistinct(field: string): Promise<string[]> {
        await connectDB();
        return InterviewQuestion.distinct(field);
    }
}

export const interviewQuestionsRepository = new InterviewQuestionsRepository();
