import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would come from the database
const DEALERS_DATA = [
  {
    id: 'dealer-001',
    name: 'Premium Motors Namibia',
    email: 'info@premiummotors.na',
    plan: 'Professional',
    monthlyFee: 499.00,
    activeListings: 25,
    totalListings: 156,
    totalSales: 89,
    monthlyRevenue: 156.00,
    rating: 4.8,
  },
  {
    id: 'dealer-002',
    name: 'Auto Palace',
    email: 'sales@autopalace.na',
    plan: 'Basic',
    monthlyFee: 199.00,
    activeListings: 18,
    totalListings: 89,
    totalSales: 45,
    monthlyRevenue: 89.00,
    rating: 4.2,
  },
  {
    id: 'dealer-003',
    name: 'Elite Autos Namibia',
    email: 'contact@eliteautos.na',
    plan: 'Professional',
    monthlyFee: 499.00,
    activeListings: 0,
    totalListings: 12,
    totalSales: 0,
    monthlyRevenue: 0,
    rating: 0.0,
  },
  {
    id: 'dealer-004',
    name: 'Coastal Cars Swakopmund',
    email: 'info@coastalcars.na',
    plan: 'Basic',
    monthlyFee: 199.00,
    activeListings: 0,
    totalListings: 34,
    totalSales: 12,
    monthlyRevenue: 0,
    rating: 3.1,
  },
  {
    id: 'dealer-005',
    name: 'Northern Auto Sales',
    email: 'sales@northernauto.na',
    plan: 'Enterprise',
    monthlyFee: 999.00,
    activeListings: 45,
    totalListings: 298,
    totalSales: 156,
    monthlyRevenue: 298.00,
    rating: 4.6,
  },
];

function generateCSV(reportType: string, dateRange: string): string {
  let csv = '';

  if (reportType === 'dealer-performance') {
    csv = 'Dealer Name,Email,Plan,Active Listings,Total Listings,Total Sales,Monthly Revenue,Rating\n';
    DEALERS_DATA.forEach(dealer => {
      csv += `"${dealer.name}","${dealer.email}","${dealer.plan}",${dealer.activeListings},${dealer.totalListings},${dealer.totalSales},${dealer.monthlyRevenue},${dealer.rating}\n`;
    });
  } else if (reportType === 'revenue') {
    csv = 'Dealer Name,Plan,Monthly Fee,Revenue Contribution\n';
    DEALERS_DATA.forEach(dealer => {
      csv += `"${dealer.name}","${dealer.plan}",${dealer.monthlyFee},${dealer.monthlyRevenue}\n`;
    });
    const totalRevenue = DEALERS_DATA.reduce((sum, d) => sum + d.monthlyRevenue, 0);
    csv += `\nTotal Revenue,,,${totalRevenue.toFixed(2)}\n`;
  } else if (reportType === 'subscriptions') {
    csv = 'Dealer Name,Subscription Plan,Monthly Fee,Status\n';
    DEALERS_DATA.forEach(dealer => {
      const status = dealer.activeListings > 0 ? 'Active' : 'Inactive';
      csv += `"${dealer.name}","${dealer.plan}",${dealer.monthlyFee},${status}\n`;
    });
  } else if (reportType === 'analytics') {
    csv = 'Dealer Name,Active Listings,Total Views,Engagement Score\n';
    DEALERS_DATA.forEach(dealer => {
      const views = dealer.activeListings * 45; // Mock views
      const engagement = (dealer.rating * 20).toFixed(1);
      csv += `"${dealer.name}",${dealer.activeListings},${views},${engagement}\n`;
    });
  } else if (reportType === 'listings') {
    csv = 'Dealer Name,Active Listings,Total Listings,Avg. Listing Performance\n';
    DEALERS_DATA.forEach(dealer => {
      const avgPerformance = dealer.totalListings > 0 ? (dealer.totalSales / dealer.totalListings * 100).toFixed(1) : '0.0';
      csv += `"${dealer.name}",${dealer.activeListings},${dealer.totalListings},${avgPerformance}%\n`;
    });
  }

  return csv;
}

function generateHTML(reportType: string, dateRange: string): string {
  const now = new Date().toLocaleString();
  let content = '';

  if (reportType === 'dealer-performance') {
    const tableRows = DEALERS_DATA.map(dealer => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${dealer.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${dealer.plan}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${dealer.activeListings}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${dealer.totalSales}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">N$${dealer.monthlyRevenue.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${dealer.rating}</td>
      </tr>
    `).join('');

    content = `
      <h2 style="color: #1e40af; margin-bottom: 20px;">Dealer Performance Report</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Dealer</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Plan</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Active Listings</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Total Sales</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d1d5db;">Revenue</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d1d5db;">Rating</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  } else if (reportType === 'revenue') {
    const totalRevenue = DEALERS_DATA.reduce((sum, d) => sum + d.monthlyRevenue, 0);
    const totalFees = DEALERS_DATA.reduce((sum, d) => sum + d.monthlyFee, 0);

    content = `
      <h2 style="color: #1e40af; margin-bottom: 20px;">Revenue & Financial Report</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 15px;">Summary</h3>
        <p><strong>Total Subscription Revenue:</strong> N$${totalFees.toFixed(2)}</p>
        <p><strong>Total Platform Revenue:</strong> N$${totalRevenue.toFixed(2)}</p>
        <p><strong>Active Dealers:</strong> ${DEALERS_DATA.length}</p>
      </div>
    `;
  } else if (reportType === 'subscriptions') {
    const activeDealers = DEALERS_DATA.filter(d => d.activeListings > 0).length;
    const planDistribution = DEALERS_DATA.reduce((acc: any, d) => {
      acc[d.plan] = (acc[d.plan] || 0) + 1;
      return acc;
    }, {});

    content = `
      <h2 style="color: #1e40af; margin-bottom: 20px;">Subscription Analytics</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 15px;">Overview</h3>
        <p><strong>Total Subscriptions:</strong> ${DEALERS_DATA.length}</p>
        <p><strong>Active Subscriptions:</strong> ${activeDealers}</p>
        <p><strong>Inactive Subscriptions:</strong> ${DEALERS_DATA.length - activeDealers}</p>
      </div>
      <h3 style="margin-bottom: 15px;">Plan Distribution</h3>
      ${Object.entries(planDistribution).map(([plan, count]) => `
        <p><strong>${plan}:</strong> ${count} dealer(s)</p>
      `).join('')}
    `;
  } else if (reportType === 'analytics') {
    const totalListings = DEALERS_DATA.reduce((sum, d) => sum + d.activeListings, 0);
    const avgRating = (DEALERS_DATA.reduce((sum, d) => sum + d.rating, 0) / DEALERS_DATA.length).toFixed(1);

    content = `
      <h2 style="color: #1e40af; margin-bottom: 20px;">Platform Analytics Report</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 15px;">Key Metrics</h3>
        <p><strong>Total Active Listings:</strong> ${totalListings}</p>
        <p><strong>Average Dealer Rating:</strong> ${avgRating}/5.0</p>
        <p><strong>Total Dealers:</strong> ${DEALERS_DATA.length}</p>
      </div>
    `;
  } else if (reportType === 'listings') {
    const totalActive = DEALERS_DATA.reduce((sum, d) => sum + d.activeListings, 0);
    const totalAll = DEALERS_DATA.reduce((sum, d) => sum + d.totalListings, 0);

    content = `
      <h2 style="color: #1e40af; margin-bottom: 20px;">Listings Overview Report</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin-bottom: 15px;">Listing Statistics</h3>
        <p><strong>Total Active Listings:</strong> ${totalActive}</p>
        <p><strong>Total Listings (All Time):</strong> ${totalAll}</p>
        <p><strong>Average per Dealer:</strong> ${(totalActive / DEALERS_DATA.length).toFixed(1)}</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #1f2937;
        }
        .header {
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="color: #1e3a8a; margin: 0;">Cars.na Admin Report</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0;">Generated on: ${now}</p>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Period: ${dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
      </div>
      ${content}
      <div class="footer">
        <p>© ${new Date().getFullYear()} Cars.na - Automotive Platform. All rights reserved.</p>
        <p>This report is confidential and intended for internal use only.</p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, reportFormat, dateRange } = body;

    // Validate input
    if (!reportType || !reportFormat || !dateRange) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    const timestamp = new Date().toISOString().split('T')[0];

    if (reportFormat === 'csv') {
      content = generateCSV(reportType, dateRange);
      mimeType = 'text/csv';
      filename = `${reportType}-${timestamp}.csv`;
    } else if (reportFormat === 'excel') {
      // For Excel, we'll use CSV with Excel mime type
      content = generateCSV(reportType, dateRange);
      mimeType = 'application/vnd.ms-excel';
      filename = `${reportType}-${timestamp}.xls`;
    } else {
      // PDF - we'll return HTML that can be printed as PDF
      content = generateHTML(reportType, dateRange);
      mimeType = 'text/html';
      filename = `${reportType}-${timestamp}.html`;
    }

    // Return file as download
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
      {
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
