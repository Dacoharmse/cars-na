import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getDealerData() {
  const dealerships = await prisma.dealership.findMany({
    include: {
      subscription: {
        include: { plan: true },
      },
      vehicles: {
        select: { id: true, status: true },
      },
      _count: {
        select: { leads: true },
      },
    },
  });

  return dealerships.map(d => ({
    name: d.name,
    email: d.email || 'N/A',
    plan: d.subscription?.plan?.name || 'None',
    monthlyFee: d.subscription?.plan?.price || 0,
    activeListings: d.vehicles.filter(v => v.status === 'AVAILABLE').length,
    totalListings: d.vehicles.length,
    totalLeads: d._count.leads,
    status: d.status,
  }));
}

function escCsv(val: unknown): string {
  const s = String(val ?? '');
  return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
}

function generateCSV(dealers: Awaited<ReturnType<typeof getDealerData>>, reportType: string): string {
  if (reportType === 'dealer-performance') {
    let csv = 'Dealer Name,Email,Plan,Active Listings,Total Listings,Total Leads\n';
    dealers.forEach(d => {
      csv += `${escCsv(d.name)},${escCsv(d.email)},${escCsv(d.plan)},${d.activeListings},${d.totalListings},${d.totalLeads}\n`;
    });
    return csv;
  }
  if (reportType === 'revenue') {
    let csv = 'Dealer Name,Plan,Monthly Fee (NAD)\n';
    dealers.forEach(d => {
      csv += `${escCsv(d.name)},${escCsv(d.plan)},${d.monthlyFee}\n`;
    });
    const total = dealers.reduce((s, d) => s + d.monthlyFee, 0);
    csv += `\nTotal Monthly Revenue,,${total.toFixed(2)}\n`;
    return csv;
  }
  if (reportType === 'subscriptions') {
    let csv = 'Dealer Name,Plan,Monthly Fee (NAD),Status\n';
    dealers.forEach(d => {
      csv += `${escCsv(d.name)},${escCsv(d.plan)},${d.monthlyFee},${d.status}\n`;
    });
    return csv;
  }
  if (reportType === 'listings') {
    let csv = 'Dealer Name,Active Listings,Total Listings\n';
    dealers.forEach(d => {
      csv += `${escCsv(d.name)},${d.activeListings},${d.totalListings}\n`;
    });
    return csv;
  }
  // analytics
  let csv = 'Dealer Name,Active Listings,Total Leads\n';
  dealers.forEach(d => {
    csv += `${escCsv(d.name)},${d.activeListings},${d.totalLeads}\n`;
  });
  return csv;
}

function generateHTML(dealers: Awaited<ReturnType<typeof getDealerData>>, reportType: string, dateRange: string): string {
  const now = new Date().toLocaleString();
  let content = '';

  if (reportType === 'dealer-performance') {
    const rows = dealers.map(d => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${d.name}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${d.plan}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.activeListings}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.totalLeads}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">N$${d.monthlyFee.toFixed(2)}</td>
      </tr>`).join('');

    content = `<h2 style="color:#1e40af;margin-bottom:20px;">Dealer Performance Report</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
        <thead><tr style="background:#f3f4f6;">
          <th style="padding:12px;text-align:left;border-bottom:2px solid #d1d5db;">Dealer</th>
          <th style="padding:12px;text-align:left;border-bottom:2px solid #d1d5db;">Plan</th>
          <th style="padding:12px;text-align:center;border-bottom:2px solid #d1d5db;">Active Listings</th>
          <th style="padding:12px;text-align:center;border-bottom:2px solid #d1d5db;">Total Leads</th>
          <th style="padding:12px;text-align:right;border-bottom:2px solid #d1d5db;">Monthly Fee</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  } else if (reportType === 'revenue') {
    const totalFees = dealers.reduce((s, d) => s + d.monthlyFee, 0);
    content = `<h2 style="color:#1e40af;margin-bottom:20px;">Revenue Report</h2>
      <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-bottom:30px;">
        <p><strong>Total Monthly Subscription Revenue:</strong> N$${totalFees.toFixed(2)}</p>
        <p><strong>Active Dealers:</strong> ${dealers.filter(d => d.plan !== 'None').length}</p>
        <p><strong>Total Dealers:</strong> ${dealers.length}</p>
      </div>`;
  } else {
    const totalActive = dealers.reduce((s, d) => s + d.activeListings, 0);
    const totalAll = dealers.reduce((s, d) => s + d.totalListings, 0);
    content = `<h2 style="color:#1e40af;margin-bottom:20px;">${reportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report</h2>
      <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-bottom:30px;">
        <p><strong>Total Active Listings:</strong> ${totalActive}</p>
        <p><strong>Total Listings:</strong> ${totalAll}</p>
        <p><strong>Dealers:</strong> ${dealers.length}</p>
      </div>`;
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>body{font-family:Arial,sans-serif;max-width:1200px;margin:0 auto;padding:40px 20px;color:#1f2937;}
    .header{border-bottom:3px solid #3b82f6;padding-bottom:20px;margin-bottom:30px;}
    .footer{margin-top:50px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;}</style>
    </head><body>
      <div class="header">
        <h1 style="color:#1e3a8a;margin:0;">Cars.na Admin Report</h1>
        <p style="color:#6b7280;margin:10px 0 0 0;">Generated on: ${now}</p>
        <p style="color:#6b7280;margin:5px 0 0 0;">Period: ${dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
      </div>
      ${content}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Cars.na - Automotive Platform. All rights reserved.</p>
      </div>
    </body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reportType, reportFormat, dateRange } = body;

    if (!reportType || !reportFormat || !dateRange) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const dealers = await getDealerData();

    let content: string;
    let mimeType: string;
    let filename: string;
    const timestamp = new Date().toISOString().split('T')[0];

    if (reportFormat === 'csv' || reportFormat === 'excel') {
      content = generateCSV(dealers, reportType);
      mimeType = reportFormat === 'csv' ? 'text/csv' : 'application/vnd.ms-excel';
      filename = `${reportType}-${timestamp}.${reportFormat === 'csv' ? 'csv' : 'xls'}`;
    } else {
      content = generateHTML(dealers, reportType, dateRange);
      mimeType = 'text/html';
      filename = `${reportType}-${timestamp}.html`;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
