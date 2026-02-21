import { NextRequest } from 'next/server';
import { coldDmsController } from '@/domains/cold-dms/cold-dms.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return coldDmsController.handleGetById(request, context);
}
