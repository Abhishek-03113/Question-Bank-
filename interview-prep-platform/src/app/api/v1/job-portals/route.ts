import { NextRequest } from 'next/server';
import { jobPortalsController } from '@/domains/job-portals/job-portals.controller';

export async function GET(request: NextRequest) {
  return jobPortalsController.handleList(request);
}
