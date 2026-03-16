import { NextRequest, NextResponse } from 'next/server';
import { runEscalationChecks } from '@/lib/invoice-generator';

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (or has the secret)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await runEscalationChecks();

    return NextResponse.json({
      success: true,
      message: `Escalation complete: ${result.restricted} restricted, ${result.suspended} suspended, ${result.deleted} deleted, ${result.reminded} reminders sent.`,
      ...result,
    });
  } catch (error) {
    console.error('Cron escalation check error:', error);
    return NextResponse.json(
      { error: 'Escalation check failed' },
      { status: 500 }
    );
  }
}
