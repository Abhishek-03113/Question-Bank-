import { NextRequest } from 'next/server';
import { sqlController } from '@/domains/sql/sql.controller';

export async function GET(request: NextRequest) {
  return sqlController.handleGetCategories(request);
}
