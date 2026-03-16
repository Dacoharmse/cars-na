/**
 * Invoice generation service for Cars.na
 * Handles PDF creation in memory (serverless-compatible), DB record management, and escalation logic.
 */
import { prisma } from './prisma';
import nodemailer from 'nodemailer';
import type { Dealership, Invoice, SubscriptionPlan, DealershipSubscription } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type DealershipWithSub = Dealership & {
  subscription: (DealershipSubscription & { plan: SubscriptionPlan }) | null;
  users: { id: string; email: string; name: string | null; role: string }[];
};

type InvoiceWithDealership = Invoice & {
  dealership: Pick<Dealership, 'id' | 'name' | 'email' | 'contactPerson' | 'streetAddress' | 'city' | 'region' | 'phone'>;
};

// ---------------------------------------------------------------------------
// Invoice number generation  INV-YYYY-MM-NNNN
// ---------------------------------------------------------------------------
async function generateInvoiceNumber(month: number, year: number): Promise<string> {
  const count = await prisma.invoice.count({
    where: { billingYear: year, billingMonth: month },
  });
  const seq = String(count + 1).padStart(4, '0');
  return `INV-${year}-${String(month).padStart(2, '0')}-${seq}`;
}

// ---------------------------------------------------------------------------
// PDF generation using pdfkit — returns Buffer (no filesystem writes)
// ---------------------------------------------------------------------------
export async function generateInvoicePDF(
  invoice: InvoiceWithDealership
): Promise<Buffer> {
  // Lazy-import pdfkit (CommonJS module)
  const PDFDocument = (await import('pdfkit')).default;

  const d = invoice.dealership;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const NAD = (n: number) => `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const monthName = new Date(invoice.billingYear, invoice.billingMonth - 1, 1)
      .toLocaleString('en-US', { month: 'long' });

    // ── Header bar ────────────────────────────────────────────────────────
    doc.rect(50, 45, 495, 60).fill('#1F3469');
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
      .text('CARS.NA', 60, 60);
    doc.fontSize(10).font('Helvetica')
      .text('Namibia\'s Premier Vehicle Marketplace', 60, 85);
    doc.fontSize(16).font('Helvetica-Bold')
      .text('TAX INVOICE', 0, 65, { align: 'right' });

    doc.fillColor('#111');

    // ── Bill To / Invoice Meta columns ────────────────────────────────────
    const y1 = 130;
    doc.fontSize(9).font('Helvetica-Bold').text('BILL TO', 50, y1);
    doc.font('Helvetica').fontSize(10)
      .text(d.name || '', 50, y1 + 14)
      .text(d.contactPerson || '', 50, y1 + 27)
      .text([d.streetAddress, d.city, d.region].filter(Boolean).join(', '), 50, y1 + 40)
      .text(d.email || '', 50, y1 + 53)
      .text(d.phone || '', 50, y1 + 66);

    doc.fontSize(9).font('Helvetica-Bold').text('INVOICE DETAILS', 350, y1);
    doc.font('Helvetica').fontSize(10);
    const metaRows = [
      ['Invoice Number:', invoice.invoiceNumber],
      ['Invoice Date:', new Date(invoice.createdAt).toLocaleDateString('en-NA')],
      ['Due Date:', new Date(invoice.dueDate).toLocaleDateString('en-NA')],
      ['Billing Period:', `${monthName} ${invoice.billingYear}`],
      ['Status:', invoice.status],
    ];
    metaRows.forEach(([label, value], i) => {
      doc.font('Helvetica-Bold').text(label, 350, y1 + 14 + i * 13, { continued: true })
        .font('Helvetica').text(` ${value}`);
    });

    // ── Line items table ──────────────────────────────────────────────────
    const tableTop = y1 + 110;
    const colDesc = 50, colQty = 310, colUnit = 370, colTotal = 450;

    // Header row
    doc.rect(50, tableTop, 495, 22).fill('#1F3469');
    doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
    doc.text('DESCRIPTION', colDesc + 5, tableTop + 7);
    doc.text('QTY', colQty, tableTop + 7);
    doc.text('UNIT PRICE', colUnit, tableTop + 7);
    doc.text('AMOUNT', colTotal, tableTop + 7);

    doc.fillColor('#111').font('Helvetica').fontSize(10);

    // Row 1 – subscription
    const r1y = tableTop + 30;
    doc.rect(50, r1y - 5, 495, 24).fill('#f8f9fa').stroke('#e5e7eb');
    doc.fillColor('#111')
      .text(`Monthly Subscription — ${invoice.planName}`, colDesc + 5, r1y)
      .text('1', colQty, r1y)
      .text(NAD(invoice.subscriptionAmount), colUnit, r1y)
      .text(NAD(invoice.subscriptionAmount), colTotal, r1y);

    // Row 2 – stock fee
    const r2y = r1y + 30;
    doc.rect(50, r2y - 5, 495, 36).fill('white').stroke('#e5e7eb');
    doc.fillColor('#111')
      .text(`Stock Value Fee (0.01% of total stock)`, colDesc + 5, r2y)
      .text(`${invoice.vehicleCount} vehicles @ total ${NAD(invoice.stockValue)}`, colDesc + 5, r2y + 12, { fontSize: 8 })
      .text(invoice.vehicleCount.toString(), colQty, r2y)
      .text(`0.01%`, colUnit, r2y)
      .text(NAD(invoice.stockFeeAmount), colTotal, r2y);

    // Subtotal / Total row
    const totY = r2y + 50;
    doc.rect(350, totY, 195, 26).fill('#1F3469');
    doc.fillColor('white').font('Helvetica-Bold').fontSize(12)
      .text('TOTAL DUE', 360, totY + 7)
      .text(NAD(invoice.totalAmount), colTotal, totY + 7);

    // ── Payment instructions ──────────────────────────────────────────────
    const payY = totY + 50;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(10)
      .text('PAYMENT INSTRUCTIONS', 50, payY);
    doc.font('Helvetica').fontSize(9)
      .text('Please transfer the amount due to the Cars.na business account within 7 days.', 50, payY + 14)
      .text('Reference your invoice number in all payment communications.', 50, payY + 26)
      .text('For queries: support@cars.na | +264 61 000 0000', 50, payY + 38);

    // ── Footer ────────────────────────────────────────────────────────────
    doc.rect(50, 770, 495, 1).fill('#e5e7eb');
    doc.fontSize(8).fillColor('#6b7280').font('Helvetica')
      .text('Cars.na — Namibia\'s Premier Vehicle Marketplace | support@cars.na | cars.na', 50, 778, { align: 'center' });

    doc.end();
  });
}

// ---------------------------------------------------------------------------
// Generate monthly invoices for all eligible dealerships
// ---------------------------------------------------------------------------
export async function generateMonthlyInvoices(
  month: number,
  year: number
): Promise<{ generated: number; skipped: number; errors: string[] }> {
  const results = { generated: 0, skipped: 0, errors: [] as string[] };

  // All APPROVED dealerships with an active subscription
  const dealerships = await prisma.dealership.findMany({
    where: { status: 'APPROVED' },
    include: {
      subscription: { include: { plan: true } },
      users: {
        where: { role: 'DEALER_PRINCIPAL' },
        select: { id: true, email: true, name: true, role: true },
      },
    },
  }) as DealershipWithSub[];

  for (const dealership of dealerships) {
    try {
      if (!dealership.subscription) {
        results.skipped++;
        continue;
      }

      // Skip if invoice already exists for this period
      const existing = await prisma.invoice.findUnique({
        where: {
          dealershipId_billingMonth_billingYear: {
            dealershipId: dealership.id,
            billingMonth: month,
            billingYear: year,
          },
        },
      });
      if (existing) {
        results.skipped++;
        continue;
      }

      // Calculate stock value (AVAILABLE vehicles only)
      const stockAgg = await prisma.vehicle.aggregate({
        where: { dealershipId: dealership.id, status: 'AVAILABLE' },
        _sum: { price: true },
        _count: { id: true },
      });
      const stockValue = stockAgg._sum.price ?? 0;
      const vehicleCount = stockAgg._count.id;

      const subscriptionAmount = dealership.subscription.plan.price;
      const stockFeeAmount = Math.round(stockValue * 0.0001 * 100) / 100; // 0.01%, 2dp
      const totalAmount = subscriptionAmount + stockFeeAmount;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const invoiceNumber = await generateInvoiceNumber(month, year);

      // Create DB record
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          dealershipId: dealership.id,
          billingMonth: month,
          billingYear: year,
          subscriptionAmount,
          stockValue,
          stockFeeAmount,
          totalAmount,
          planName: dealership.subscription.plan.name,
          vehicleCount,
          dueDate,
          sentAt: new Date(),
        },
        include: {
          dealership: {
            select: { id: true, name: true, email: true, contactPerson: true, streetAddress: true, city: true, region: true, phone: true },
          },
        },
      }) as InvoiceWithDealership;

      // Generate PDF buffer (no filesystem needed)
      let pdfBuffer: Buffer | null = null;
      try {
        pdfBuffer = await generateInvoicePDF(invoice);
        // Store a marker that PDF was generated (no file path needed)
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { pdfPath: `/invoices/${invoice.invoiceNumber}.pdf` },
        });
      } catch (pdfErr) {
        console.error(`PDF generation failed for ${invoiceNumber}:`, pdfErr);
      }

      // Create dashboard notification for dealer principal
      for (const user of dealership.users) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'INVOICE_GENERATED',
            title: 'New Invoice Generated',
            message: `Your invoice ${invoiceNumber} for ${new Date(year, month - 1).toLocaleString('en-US', { month: 'long' })} ${year} has been generated. Total due: N$ ${totalAmount.toLocaleString('en-NA', { minimumFractionDigits: 2 })}. Due by ${dueDate.toLocaleDateString('en-NA')}.`,
            link: '/dealer/invoices',
            metadata: { invoiceId: invoice.id, invoiceNumber, totalAmount, dueDate: dueDate.toISOString() },
          },
        });
      }

      // Send email to dealer principal with PDF attachment
      const principal = dealership.users[0];
      if (principal?.email) {
        await sendInvoiceEmail(principal, dealership, invoice, pdfBuffer).catch(err =>
          console.error(`Invoice email failed for ${dealership.name}:`, err.message)
        );
      }

      results.generated++;
    } catch (err: any) {
      console.error(`Failed to generate invoice for dealership ${dealership.id}:`, err.message);
      results.errors.push(`${dealership.name}: ${err.message}`);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Escalation checks — run once per day (admin-triggered or crontab)
// ---------------------------------------------------------------------------
export async function runEscalationChecks(): Promise<{
  restricted: number;
  suspended: number;
  deleted: number;
  reminded: number;
}> {
  const stats = { restricted: 0, suspended: 0, deleted: 0, reminded: 0 };
  const now = new Date();

  const unpaidInvoices = await prisma.invoice.findMany({
    where: { status: { in: ['PENDING', 'OVERDUE'] } },
    include: {
      dealership: {
        include: {
          users: {
            where: { role: 'DEALER_PRINCIPAL' },
            select: { id: true, email: true, name: true, role: true },
          },
        },
      },
    },
  });

  for (const invoice of unpaidInvoices) {
    const daysOverdue = Math.floor(
      (now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysOverdue < 0) continue; // Not yet due

    const dealership = invoice.dealership as any;
    const principal = dealership.users?.[0];

    // ── 60+ days: delete dealership ────────────────────────────────────
    if (daysOverdue >= 60) {
      try {
        await prisma.$transaction([
          prisma.lead.deleteMany({ where: { dealershipId: dealership.id } }),
          prisma.vehicle.deleteMany({ where: { dealershipId: dealership.id } }),
          prisma.dealershipSubscription.deleteMany({ where: { dealershipId: dealership.id } }),
          prisma.subscriptionNotification.deleteMany({ where: { dealershipId: dealership.id } }),
          prisma.dealerInterest.deleteMany({ where: { dealershipId: dealership.id } }),
          prisma.dealership.delete({ where: { id: dealership.id } }),
        ]);
        stats.deleted++;
      } catch (err: any) {
        console.error(`Failed to delete dealership ${dealership.id}:`, err.message);
      }
      continue;
    }

    // ── 30+ days: suspend dealership (hides from public) ───────────────
    if (daysOverdue >= 30 && dealership.status !== 'SUSPENDED') {
      await prisma.dealership.update({
        where: { id: dealership.id },
        data: { status: 'SUSPENDED' },
      });
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'OVERDUE' },
      });
      for (const user of dealership.users) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'ACCESS_RESTRICTED',
            title: 'Dealership Suspended — Invoice Overdue',
            message: `Your dealership has been suspended because invoice ${invoice.invoiceNumber} is ${daysOverdue} days overdue. All listings are now hidden. Please contact support@cars.na immediately.`,
            link: '/dealer/invoices',
          },
        });
      }
      if (principal?.email) {
        await sendInvoiceReminderEmail(principal, dealership, invoice, daysOverdue).catch(() => {});
      }
      stats.suspended++;
      continue;
    }

    // ── 7+ days: restrict write access ─────────────────────────────────
    if (daysOverdue >= 7 && !dealership.accessRestrictedAt) {
      await prisma.dealership.update({
        where: { id: dealership.id },
        data: { accessRestrictedAt: now },
      });
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'OVERDUE' },
      });
      for (const user of dealership.users) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'INVOICE_OVERDUE',
            title: 'Invoice Overdue — Access Restricted',
            message: `Invoice ${invoice.invoiceNumber} is ${daysOverdue} days overdue. Your ability to add or edit listings has been restricted. Pay now to restore full access.`,
            link: '/dealer/invoices',
          },
        });
      }
      stats.restricted++;
    }

    // ── Daily reminder emails for all unpaid invoices ─────────────────
    const lastReminder = invoice.lastReminderAt ? new Date(invoice.lastReminderAt) : null;
    const hoursSinceReminder = lastReminder
      ? (now.getTime() - lastReminder.getTime()) / (1000 * 60 * 60)
      : 999;

    if (hoursSinceReminder >= 24 && principal?.email) {
      await sendInvoiceReminderEmail(principal, dealership, invoice, daysOverdue).catch(() => {});
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { lastReminderAt: now, reminderCount: { increment: 1 } },
      });
      stats.reminded++;
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Email helpers (internal to this module)
// ---------------------------------------------------------------------------
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || 'localhost';
  const isLocalSmtp = smtpHost === 'localhost' || smtpHost === '127.0.0.1';
  const config: any = {
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '25'),
    secure: process.env.SMTP_SECURE === 'true',
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalSmtp },
  };
  if (process.env.SMTP_REQUIRE_AUTH === 'true') {
    config.auth = { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' };
  }
  return nodemailer.createTransport(config);
}

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

async function sendInvoiceEmail(
  principal: { email: string; name: string | null },
  dealership: Pick<Dealership, 'name'>,
  invoice: InvoiceWithDealership,
  pdfBuffer: Buffer | null
): Promise<void> {
  const transporter = createTransporter();
  const NAD = (n: number) => `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2 })}`;
  const monthName = new Date(invoice.billingYear, invoice.billingMonth - 1).toLocaleString('en-US', { month: 'long' });

  const attachments: any[] = [];
  if (pdfBuffer) {
    attachments.push({ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' });
  }

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
    to: principal.email,
    subject: `Invoice ${invoice.invoiceNumber} — ${monthName} ${invoice.billingYear} — Due ${new Date(invoice.dueDate).toLocaleDateString('en-NA')}`,
    attachments,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
  <div style="background:linear-gradient(135deg,#1F3469 0%,#3B4F86 100%);padding:30px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:24px;">Invoice ${esc(invoice.invoiceNumber)}</h1>
    <p style="color:#ffffff;opacity:0.9;margin:10px 0 0 0;">${esc(monthName)} ${invoice.billingYear} — Cars.na</p>
  </div>
  <div style="padding:30px;">
    <p style="color:#374151;font-size:16px;">Dear ${esc(principal.name || 'Dealer Principal')},</p>
    <p style="color:#374151;">Please find your invoice for ${esc(monthName)} ${invoice.billingYear} attached to this email.</p>
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
    <div style="text-align:center;margin-top:25px;">
      <a href="${process.env.NEXTAUTH_URL || 'https://cars.na'}/dealer/invoices" style="display:inline-block;background:linear-gradient(135deg,#1F3469 0%,#3B4F86 100%);color:white;padding:14px 35px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">View Invoices</a>
    </div>
  </div>
  <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6b7280;font-size:14px;">
    <p style="margin:0;">Cars.na | support@cars.na</p>
  </div>
</div></body></html>`,
  });
}

async function sendInvoiceReminderEmail(
  principal: { email: string; name: string | null },
  dealership: Pick<Dealership, 'name'>,
  invoice: Invoice,
  daysOverdue: number
): Promise<void> {
  const transporter = createTransporter();
  const NAD = (n: number) => `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2 })}`;
  const urgency = daysOverdue >= 30 ? '🚨 URGENT' : daysOverdue >= 14 ? '⚠️ OVERDUE' : '📋 Reminder';

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
    to: principal.email,
    subject: `${urgency}: Invoice ${invoice.invoiceNumber} is ${daysOverdue} days overdue — Action Required`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
  <div style="background:${daysOverdue >= 30 ? '#dc2626' : '#f59e0b'};padding:30px 20px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:24px;">${daysOverdue >= 30 ? '🚨 Account Suspended' : '⚠️ Payment Overdue'}</h1>
    <p style="color:#ffffff;opacity:0.9;margin:10px 0 0 0;">Invoice ${esc(invoice.invoiceNumber)} is ${daysOverdue} days overdue</p>
  </div>
  <div style="padding:30px;">
    <p style="color:#374151;">Dear ${esc(principal.name || 'Dealer Principal')},</p>
    <p style="color:#374151;">Your invoice <strong>${esc(invoice.invoiceNumber)}</strong> for <strong>${NAD((invoice as any).totalAmount)}</strong> is now <strong>${daysOverdue} days overdue</strong>.</p>
    ${daysOverdue >= 30 ? '<p style="color:#dc2626;font-weight:600;">Your dealership and all listings have been suspended and are no longer visible to the public.</p>' :
      daysOverdue >= 7 ? '<p style="color:#f59e0b;font-weight:600;">Your ability to add or edit vehicle listings has been restricted.</p>' : ''}
    <p style="color:#374151;">Please settle your account immediately to restore full access.</p>
    <div style="text-align:center;margin-top:25px;">
      <a href="${process.env.NEXTAUTH_URL || 'https://cars.na'}/dealer/invoices" style="display:inline-block;background:#dc2626;color:white;padding:14px 35px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">View Invoice & Pay Now</a>
    </div>
    <p style="color:#6b7280;font-size:13px;margin-top:20px;">Contact us at support@cars.na if you have already made payment.</p>
  </div>
</div></body></html>`,
  });
}
