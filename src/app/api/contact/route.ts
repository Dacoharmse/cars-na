import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { withRateLimit, contactLimiter } from '@/lib/rate-limit';

// Escape user input before embedding in HTML email
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, { ...contactLimiter, endpoint: 'contact' }, async () => {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, subject, category, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    const smtpHost = process.env.SMTP_HOST || 'localhost';
    const isLocalhost = smtpHost === 'localhost' || smtpHost === '127.0.0.1';
    const requireAuth = process.env.SMTP_REQUIRE_AUTH === 'true';

    const config: any = {
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '25'),
      secure: process.env.SMTP_SECURE === 'true',
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalhost,
      },
    };

    if (requireAuth || !isLocalhost) {
      config.auth = {
        user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
      };
    }

    const transporter = nodemailer.createTransport(config);

    // Format the category display name
    const categoryLabels: Record<string, string> = {
      general: 'General Inquiry',
      buying: 'Buying a Vehicle',
      selling: 'Selling a Vehicle',
      dealer: 'Dealer Partnership',
      technical: 'Technical Support',
      feedback: 'Feedback',
      other: 'Other',
    };

    const categoryDisplay = category ? (categoryLabels[category] || esc(category)) : 'Not specified';

    // Generate email HTML — all user values escaped
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Cars.na</h1>
              <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">New Contact Form Submission</p>
            </div>

            <div style="padding: 30px;">
              <h2 style="color: #1F3469; margin-top: 0; margin-bottom: 20px;">Contact Details</h2>

              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600; width: 120px;">Name:</td>
                    <td style="padding: 10px 0; color: #374151;">${esc(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Email:</td>
                    <td style="padding: 10px 0; color: #374151;"><a href="mailto:${esc(email)}" style="color: #1F3469;">${esc(email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                    <td style="padding: 10px 0; color: #374151;">${esc(phone || 'Not provided')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Category:</td>
                    <td style="padding: 10px 0; color: #374151;">${categoryDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Subject:</td>
                    <td style="padding: 10px 0; color: #374151; font-weight: 600;">${esc(subject)}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px;">
                <h3 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">Message:</h3>
                <p style="color: #92400e; margin: 0; white-space: pre-wrap; line-height: 1.6;">${esc(message)}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #f0f9f5; border-radius: 8px;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <strong>Quick Actions:</strong><br>
                  <a href="mailto:${esc(email)}?subject=Re: ${esc(subject)}" style="color: #1F3469;">Reply to ${esc(name)}</a>
                  ${phone ? ` | <a href="tel:${esc(phone.replace(/\s/g, ''))}" style="color: #1F3469;">Call ${esc(phone)}</a>` : ''}
                </p>
              </div>
            </div>

            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">This message was sent via the Cars.na contact form</p>
              <p style="margin: 10px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission - Cars.na

CONTACT DETAILS:
----------------
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Category: ${categoryDisplay}
Subject: ${subject}

MESSAGE:
--------
${message}

---
This message was sent via the Cars.na contact form
${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}
    `;

    // Send email to support
    const mailOptions = {
      from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
      to: process.env.ADMIN_EMAIL || 'support@cars.na',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: textContent,
    };

    // Try to send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Contact form email sent successfully');

      return NextResponse.json(
        { success: true, message: 'Your message has been sent successfully. We will get back to you soon!' },
        { status: 200 }
      );
    } catch (emailError: any) {
      // In development mode, log the email details and return success
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 CONTACT FORM EMAIL (Development Mode - SMTP not available)');
        console.log('=====================================');
        console.log('SMTP Error:', emailError.message);
        console.log('From:', mailOptions.from);
        console.log('To:', mailOptions.to);
        console.log('Reply-To:', mailOptions.replyTo);
        console.log('Subject:', mailOptions.subject);
        console.log('Content:', textContent);
        console.log('=====================================');
        console.log('Note: Email would be sent in production when SMTP server is accessible');

        return NextResponse.json(
          { success: true, message: 'Contact form submitted successfully (development mode - email logged to console)' },
          { status: 200 }
        );
      }

      // In production, re-throw the error
      throw emailError;
    }

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
  }); // end withRateLimit
}

export async function GET() {
  return NextResponse.json({
    status: 'Contact API is running',
    supportEmail: process.env.ADMIN_EMAIL || 'support@cars.na',
    fromEmail: 'no-reply@cars.na',
  });
}
