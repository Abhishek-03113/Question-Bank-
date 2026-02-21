import { NextRequest } from 'next/server';
import { aptitudeController } from '@/domains/aptitude/aptitude.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return aptitudeController.handleGetById(request, context);
}
