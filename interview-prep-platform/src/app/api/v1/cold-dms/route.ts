import { NextRequest } from 'next/server';
import { coldDmsController } from '@/domains/cold-dms/cold-dms.controller';

export async function GET(request: NextRequest) {
  return coldDmsController.handleList(request);
}
