import { NextRequest } from 'next/server';
import { interviewQuestionsController } from '@/domains/interview-questions/interview-questions.controller';

export async function GET(request: NextRequest) {
  return interviewQuestionsController.handleGetDomains(request);
}
