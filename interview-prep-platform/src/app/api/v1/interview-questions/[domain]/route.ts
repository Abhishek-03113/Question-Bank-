import { NextRequest } from 'next/server';
import { interviewQuestionsController } from '@/domains/interview-questions/interview-questions.controller';

export async function GET(request: NextRequest, context: { params: { domain: string } }) {
  return interviewQuestionsController.handleListByDomain(request, context);
}
