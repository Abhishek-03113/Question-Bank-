import { NextRequest } from 'next/server';
import { interviewQuestionsController } from '@/domains/interview-questions/interview-questions.controller';

export async function GET(
  request: NextRequest,
  context: { params: { domain: string; id: string } }
) {
  return interviewQuestionsController.handleGetByDomainAndId(request, context);
}
