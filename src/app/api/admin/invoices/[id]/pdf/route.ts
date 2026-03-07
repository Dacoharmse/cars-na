import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/admin/invoices/[id]/pdf — generate (if needed) and download invoice PDF
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        dealership: {
          select: { id: true, name: true, email: true, contactPerson: true, streetAddress: true, city: true, region: true, phone: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // If PDF doesn't exist yet, generate it
    let pdfPath = invoice.pdfPath;
    if (!pdfPath) {
      pdfPath = await generateInvoicePDF(invoice as any);
      await prisma.invoice.update({
        where: { id },
        data: { pdfPath },
      });
    }

    const filePath = path.join(process.cwd(), 'public', pdfPath);

    // If file is missing on disk, regenerate
    try {
      await fs.access(filePath);
    } catch {
      pdfPath = await generateInvoicePDF(invoice as any);
      await prisma.invoice.update({
        where: { id },
        data: { pdfPath },
      });
    }

    const finalPath = path.join(process.cwd(), 'public', pdfPath);
    const fileBuffer = await fs.readFile(finalPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Error generating/serving invoice PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
