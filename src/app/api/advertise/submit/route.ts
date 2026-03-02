import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { withRateLimit, advertiseLimiter } from '@/lib/rate-limit';

// Escape user input before embedding in HTML email
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validate that a string is a valid URL
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, { ...advertiseLimiter, endpoint: 'advertise' }, async () => {
  try {
    const body = await request.json();
    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      bannerPosition,
      campaignDuration,
      message,
      budget
    } = body;

    // Validate required fields
    if (!companyName || !contactName || !email || !phone || !bannerPosition || !campaignDuration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate website URL if provided
    if (website && !isValidUrl(website)) {
      return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 });
    }

    // Normalise website URL for display (always https://)
    const safeWebsite = website
      ? (website.startsWith('http') ? website : `https://${website}`)
      : null;

    // Create email transporter
    let transporter: nodemailer.Transporter;
    const smtpHost = process.env.SMTP_HOST;
    const isLocalSmtp = smtpHost === 'localhost' || smtpHost === '127.0.0.1';

    if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalSmtp },
      });
    } else {
      // Use Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Get banner position details
    const positionDetails: Record<string, { name: string; price: string }> = {
      HERO: { name: 'Hero Banner', price: 'N$15,000/month' },
      MAIN: { name: 'Main Banner', price: 'N$10,000/month' },
      SIDEBAR: { name: 'Sidebar Banner', price: 'N$8,000/month' },
      BETWEEN: { name: 'Content Banner', price: 'N$6,500/month' },
    };

    const selectedPosition = positionDetails[bannerPosition] || positionDetails.MAIN;
    const durationLabel = `${campaignDuration} ${campaignDuration === '1' ? 'month' : 'months'}`;

    // Send email to admin — all user values escaped
    const adminMailOptions = {
      from: process.env.SMTP_FROM || '"Cars.na Advertising" <advertising@cars.na>',
      to: process.env.ADMIN_EMAIL || 'admin@cars.na',
      subject: `New Advertising Application - ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #2A4A7A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #1F3469; }
            .field-label { font-weight: bold; color: #1F3469; margin-bottom: 5px; }
            .field-value { color: #666; }
            .highlight { background: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Advertising Application</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Cars.na Advertising Platform</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #1F3469; font-weight: bold;">
                A new company has applied for advertising on Cars.na
              </p>

              <div class="highlight">
                <div class="field-label">Selected Package</div>
                <div style="font-size: 18px; font-weight: bold; color: #1F3469;">
                  ${esc(selectedPosition.name)} - ${esc(selectedPosition.price)}
                </div>
                <div style="font-size: 14px; color: #666; margin-top: 5px;">
                  Campaign Duration: ${esc(durationLabel)}
                </div>
              </div>

              <h3 style="color: #1F3469; margin-top: 30px;">Company Information</h3>

              <div class="field">
                <div class="field-label">Company Name</div>
                <div class="field-value">${esc(companyName)}</div>
              </div>

              <div class="field">
                <div class="field-label">Contact Person</div>
                <div class="field-value">${esc(contactName)}</div>
              </div>

              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${esc(email)}">${esc(email)}</a></div>
              </div>

              <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">${esc(phone)}</div>
              </div>

              ${safeWebsite ? `
                <div class="field">
                  <div class="field-label">Website</div>
                  <div class="field-value"><a href="${esc(safeWebsite)}" target="_blank" rel="noopener noreferrer">${esc(safeWebsite)}</a></div>
                </div>
              ` : ''}

              ${budget ? `
                <div class="field">
                  <div class="field-label">Estimated Budget</div>
                  <div class="field-value">${esc(budget)}</div>
                </div>
              ` : ''}

              ${message ? `
                <div class="field">
                  <div class="field-label">Additional Information</div>
                  <div class="field-value" style="white-space: pre-wrap;">${esc(message)}</div>
                </div>
              ` : ''}

              <div style="margin-top: 30px; padding: 20px; background: #1F3469; color: white; border-radius: 6px; text-align: center;">
                <p style="margin: 0; font-size: 14px;">
                  Please respond to this application within 24 hours
                </p>
              </div>
            </div>
            <div class="footer">
              <p>Cars.na Advertising Platform</p>
              <p>This is an automated notification from the Cars.na advertising system</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Advertising Application - Cars.na

Company: ${companyName}
Contact: ${contactName}
Email: ${email}
Phone: ${phone}
Website: ${safeWebsite || 'Not provided'}

Selected Package: ${selectedPosition.name} - ${selectedPosition.price}
Campaign Duration: ${durationLabel}
Budget: ${budget || 'Not specified'}

Additional Information:
${message || 'None provided'}
      `
    };

    // Send confirmation email to applicant — only safe static content
    const applicantMailOptions = {
      from: process.env.SMTP_FROM || '"Cars.na Advertising" <advertising@cars.na>',
      to: email,
      subject: 'Your Advertising Application - Cars.na',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #2A4A7A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #FEF3C7; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Application Received</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Cars.na</p>
            </div>
            <div class="content">
              <p>Dear ${esc(contactName)},</p>
              <p>Thank you for your interest in advertising with Cars.na, Namibia's leading automotive marketplace.</p>
              <div class="highlight">
                <h2 style="margin: 0 0 10px 0; color: #1F3469;">Your Application Details</h2>
                <p style="font-size: 18px; font-weight: bold; margin: 5px 0;">${esc(selectedPosition.name)}</p>
                <p style="margin: 5px 0; color: #666;">${esc(selectedPosition.price)} &bull; ${esc(durationLabel)}</p>
              </div>
              <h3 style="color: #1F3469;">What Happens Next?</h3>
              <ol style="padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our advertising team will review your application</li>
                <li style="margin-bottom: 10px;">We'll contact you within <strong>24 hours</strong> to discuss your campaign</li>
                <li style="margin-bottom: 10px;">Once approved, your banner goes live within 24-48 hours</li>
              </ol>
              <p>In the meantime, if you have any questions, feel free to contact us:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Email: advertising@cars.na</li>
                <li>Phone: +264 81 449 4433</li>
              </ul>
            </div>
            <div class="footer">
              <p><strong>Cars.na</strong> - Namibia's #1 Automotive Marketplace</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Thank you for your advertising application!

Dear ${contactName},

We've received your application for ${selectedPosition.name} (${selectedPosition.price}).

What happens next?
1. Our team will review your application
2. We'll contact you within 24 hours
3. Your banner goes live within 24-48 hours after approval

Contact us:
Email: advertising@cars.na
Phone: +264 81 449 4433

Thank you for choosing Cars.na!
      `
    };

    try {
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(applicantMailOptions)
      ]);
    } catch (emailError: any) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 ADVERTISE EMAIL (Development Mode - SMTP not available):', emailError.message);
        return NextResponse.json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
      }
      throw emailError;
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing advertising application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
  }); // end withRateLimit
}
