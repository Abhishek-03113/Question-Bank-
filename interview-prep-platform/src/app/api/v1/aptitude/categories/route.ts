import { NextRequest } from 'next/server';
import { aptitudeController } from '@/domains/aptitude/aptitude.controller';

export async function GET(request: NextRequest) {
  return aptitudeController.handleGetCategories(request);
}
