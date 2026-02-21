import { NextRequest } from 'next/server';
import { sqlController } from '@/domains/sql/sql.controller';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return sqlController.handleGetById(request, context);
}
