import { interviewQuestionsRepository } from './interview-questions.repository';
import { ListQuery } from '@/lib/types';

const VALID_DOMAINS = ['ai', 'backend', 'frontend', 'general', 'java', 'system_design', 'data_analyst'] as const;

export class InterviewQuestionsService {
    async getAll(query: ListQuery) {
        const { page = 1, limit = 20, difficulty, domain, search } = query;
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const skip = (safePage - 1) * safeLimit;

        const filters: Record<string, unknown> = {};
        if (difficulty) filters.difficulty = difficulty;
        if (domain) filters.domain = domain;
        if (search) filters.question = { $regex: search, $options: 'i' };

        const [data, total] = await interviewQuestionsRepository.findAll(filters, skip, safeLimit);
        return { data, total, page: safePage, limit: safeLimit };
    }

    async getByDomain(domain: string, query: ListQuery) {
        return this.getAll({ ...query, domain });
    }

    async getById(id: number, domain?: string) {
        const doc = await interviewQuestionsRepository.findById(id, domain);
        if (!doc) throw { status: 404, message: 'Interview question not found' };
        return doc;
    }

    getDomains(): string[] {
        return [...VALID_DOMAINS];
    }
}

export const interviewQuestionsService = new InterviewQuestionsService();
