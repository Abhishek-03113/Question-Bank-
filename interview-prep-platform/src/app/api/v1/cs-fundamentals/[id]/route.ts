import { NextRequest } from 'next/server';
import { csFundamentalsController } from '@/domains/cs-fundamentals/cs-fundamentals.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return csFundamentalsController.handleGetById(request, context);
}
