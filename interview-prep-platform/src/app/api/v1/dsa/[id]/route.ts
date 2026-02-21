import { NextRequest } from 'next/server';
import { dsaController } from '@/domains/dsa/dsa.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return dsaController.handleGetById(request, context);
}
