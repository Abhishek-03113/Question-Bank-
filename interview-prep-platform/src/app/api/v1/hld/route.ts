import { NextRequest } from 'next/server';
import { hldController } from '@/domains/hld/hld.controller';

export async function GET(request: NextRequest) {
  return hldController.handleList(request);
}
