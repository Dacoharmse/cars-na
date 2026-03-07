import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs/promises';

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || 'localhost';
  const isLocalSmtp = smtpHost === 'localhost' || smtpHost === '127.0.0.1';
  const config: Record<string, unknown> = {
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '25'),
    secure: process.env.SMTP_SECURE === 'true',
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalSmtp },
  };
  if (process.env.SMTP_REQUIRE_AUTH === 'true') {
    config.auth = { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' };
  }
  return nodemailer.createTransport(config as nodemailer.TransportOptions);
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// POST /api/admin/invoices/[id]/send — send invoice email to specified address
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { to } = await req.json();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json({ error: 'Valid email address required' }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { dealership: { select: { name: true, email: true, contactPerson: true } } },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const NAD = (n: number) => `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2 })}`;
    const monthName = new Date(invoice.billingYear, invoice.billingMonth - 1).toLocaleString('en-US', { month: 'long' });

    const attachments: { filename: string; path: string }[] = [];
    if (invoice.pdfPath) {
      const pdfFullPath = path.join(process.cwd(), 'public', invoice.pdfPath);
      try {
        await fs.access(pdfFullPath);
        attachments.push({ filename: `${invoice.invoiceNumber}.pdf`, path: pdfFullPath });
      } catch { /* PDF file missing, send without attachment */ }
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
      to,
      subject: `Invoice ${invoice.invoiceNumber} — ${monthName} ${invoice.billingYear} — Due ${new Date(invoice.dueDate).toLocaleDateString('en-NA')}`,
      attachments,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
  <div style="background:linear-gradient(135deg,#1F3469 0%,#3B4F86 100%);padding:30px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:24px;">Invoice ${esc(invoice.invoiceNumber)}</h1>
    <p style="color:#ffffff;opacity:0.9;margin:10px 0 0 0;">${esc(monthName)} ${invoice.billingYear} — Cars.na</p>
  </div>
  <div style="padding:30px;">
    <p style="color:#374151;font-size:16px;">Dear ${esc(invoice.dealership.contactPerson || 'Dealer')},</p>
    <p style="color:#374151;">Please find the invoice for <strong>${esc(invoice.dealership.name)}</strong> for ${esc(monthName)} ${invoice.billingYear}.</p>
    <div style="background:#fef3c7;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #f59e0b;">
      <h3 style="color:#92400e;margin:0 0 12px 0;">Invoice Summary</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">Monthly Subscription (${esc(invoice.planName)}):</td><td style="padding:6px 0;color:#374151;text-align:right;">${NAD(invoice.subscriptionAmount)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">Stock Value Fee (0.1% of ${NAD(invoice.stockValue)}):</td><td style="padding:6px 0;color:#374151;text-align:right;">${NAD(invoice.stockFeeAmount)}</td></tr>
        <tr style="border-top:2px solid #e5e7eb;"><td style="padding:10px 0;color:#111;font-weight:700;font-size:16px;">TOTAL DUE:</td><td style="padding:10px 0;color:#16a34a;font-weight:700;font-size:18px;text-align:right;">${NAD(invoice.totalAmount)}</td></tr>
      </table>
      <p style="margin:10px 0 0 0;color:#92400e;font-weight:600;">Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-NA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <p style="color:#374151;">Please ensure payment is made by the due date to avoid service restrictions.</p>
  </div>
  <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6b7280;font-size:14px;">
    <p style="margin:0;">Cars.na | support@cars.na</p>
  </div>
</div></body></html>`,
    });

    return NextResponse.json({ success: true, message: `Invoice sent to ${to}` });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json({ error: 'Failed to send invoice email' }, { status: 500 });
  }
}
