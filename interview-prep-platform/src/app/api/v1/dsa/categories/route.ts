import { NextRequest } from 'next/server';
import { dsaController } from '@/domains/dsa/dsa.controller';

export async function GET(request: NextRequest) {
  return dsaController.handleGetCategories(request);
}
