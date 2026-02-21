import { NextRequest } from 'next/server';
import { hldController } from '@/domains/hld/hld.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return hldController.handleGetById(request, context);
}
