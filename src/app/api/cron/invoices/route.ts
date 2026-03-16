import { NextRequest, NextResponse } from 'next/server';
import { generateMonthlyInvoices } from '@/lib/invoice-generator';

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (or has the secret)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const result = await generateMonthlyInvoices(month, year);

    return NextResponse.json({
      success: true,
      message: `Invoice generation completed for ${month}/${year}`,
      ...result,
    });
  } catch (error) {
    console.error('Cron invoice generation error:', error);
    return NextResponse.json(
      { error: 'Invoice generation failed' },
      { status: 500 }
    );
  }
}
