import { NextRequest } from 'next/server';
import { lldController } from '@/domains/lld/lld.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return lldController.handleGetById(request, context);
}
