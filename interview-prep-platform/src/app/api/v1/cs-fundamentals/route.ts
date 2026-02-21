import { NextRequest } from 'next/server';
import { csFundamentalsController } from '@/domains/cs-fundamentals/cs-fundamentals.controller';

export async function GET(request: NextRequest) {
  return csFundamentalsController.handleList(request);
}
