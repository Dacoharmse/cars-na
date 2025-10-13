import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
// In production, use your actual SMTP credentials
const createTransporter = () => {
  // Check if SMTP credentials are configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to ethereal for testing (fake SMTP service)
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message, recipients } = body;

    // Validate input
    if (!subject || !message || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: 'Invalid request. Subject, message, and recipients are required.' },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients specified.' },
        { status: 400 }
      );
    }

    // Create transporter
    let transporter = createTransporter();

    // If no transporter configured, create a test account
    if (!transporter) {
      console.log('No SMTP configured, creating test account...');
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

    // Send emails to all recipients
    const emailPromises = recipients.map(async (recipient: { email: string; name: string }) => {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Cars.na Admin" <admin@cars.na>',
        to: recipient.email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                }
                .footer {
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  font-size: 12px;
                  color: #6b7280;
                }
                .message {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                  white-space: pre-wrap;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Cars.na Newsletter</h1>
                </div>
                <div class="content">
                  <p>Hello ${recipient.name},</p>
                  <div class="message">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                  <div class="footer">
                    <p>This email was sent to you as a registered dealer on Cars.na platform.</p>
                    <p>© ${new Date().getFullYear()} Cars.na - Automotive Platform. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `Hello ${recipient.name},\n\n${message}\n\nThis email was sent to you as a registered dealer on Cars.na platform.\n© ${new Date().getFullYear()} Cars.na - Automotive Platform. All rights reserved.`,
      };

      const info = await transporter!.sendMail(mailOptions);

      // Log preview URL for test emails (ethereal)
      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return {
        recipient: recipient.email,
        messageId: info.messageId,
        success: true,
      };
    });

    const results = await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${recipients.length} recipients`,
      results,
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      {
        error: 'Failed to send newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
