import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/invoices/[id]/pdf — stream PDF to dealer
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { id: true, dealershipId: true, invoiceNumber: true, pdfPath: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Verify ownership — dealer must own this invoice; admin can access any
    if (session.user.role !== 'ADMIN') {
      if (invoice.dealershipId !== session.user.dealershipId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (!invoice.pdfPath) {
      return NextResponse.json({ error: 'PDF not available for this invoice' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', invoice.pdfPath);

    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'private, no-store',
        },
      });
    } catch {
      return NextResponse.json({ error: 'PDF file not found on server' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving invoice PDF:', error);
    return NextResponse.json({ error: 'Failed to serve PDF' }, { status: 500 });
  }
}
