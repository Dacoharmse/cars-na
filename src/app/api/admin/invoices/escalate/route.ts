import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runEscalationChecks } from '@/lib/invoice-generator';

// POST /api/admin/invoices/escalate — run escalation checks
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await runEscalationChecks();

    return NextResponse.json({
      success: true,
      message: `Escalation complete: ${result.restricted} restricted, ${result.suspended} suspended, ${result.deleted} deleted, ${result.reminded} reminders sent.`,
      ...result,
    });
  } catch (error) {
    console.error('Escalation check error:', error);
    return NextResponse.json({ error: 'Escalation check failed' }, { status: 500 });
  }
}
