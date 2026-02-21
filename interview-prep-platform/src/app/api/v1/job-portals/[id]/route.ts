import { NextRequest } from 'next/server';
import { jobPortalsController } from '@/domains/job-portals/job-portals.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return jobPortalsController.handleGetById(request, context);
}
