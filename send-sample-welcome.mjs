import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envFile = readFileSync(resolve(__dirname, '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  }
});

const config = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

async function sendSampleEmail() {
  try {
    const transporter = nodemailer.createTransport(config);

    console.log('📧 Sending sample welcome email to dacoharmse13.dh@gmail.com...');

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'dacoharmse13.dh@gmail.com',
      subject: '✅ Welcome Email Sample - Cars.na Dealership System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #109B4A 0%, #0d7a3a 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 40px 30px;
              background: #f9fafb;
            }
            .success-box {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border-left: 4px solid #109B4A;
            }
            .email-list {
              background: white;
              border-radius: 8px;
              padding: 25px;
              margin: 20px 0;
            }
            .email-item {
              padding: 15px;
              margin: 10px 0;
              background: #f8f9fa;
              border-radius: 6px;
              border-left: 3px solid #109B4A;
            }
            .footer {
              text-align: center;
              padding: 30px;
              color: #666;
              font-size: 13px;
              background: #f9fafb;
            }
            .highlight {
              color: #109B4A;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Welcome Email Campaign Complete!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">All dealership welcome emails sent successfully</p>
            </div>

            <div class="content">
              <div class="success-box">
                <h2 style="color: #109B4A; margin-top: 0;">🎉 Campaign Summary</h2>
                <p style="font-size: 16px;">
                  Welcome emails have been successfully sent to all <strong>3 registered dealerships</strong> on Cars.na!
                </p>
                <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 6px;">
                  <p style="margin: 5px 0;"><strong>✅ Total Sent:</strong> 3 emails</p>
                  <p style="margin: 5px 0;"><strong>✅ Success Rate:</strong> 100%</p>
                  <p style="margin: 5px 0;"><strong>📧 Mail Server:</strong> smtp.stackmail.com</p>
                  <p style="margin: 5px 0;"><strong>⏰ Sent At:</strong> ${new Date().toLocaleString()}</p>
                </div>
              </div>

              <div class="email-list">
                <h3 style="margin-top: 0; color: #1F3469;">📬 Emails Sent To:</h3>

                <div class="email-item">
                  <strong>1. Want Media CC</strong><br>
                  <span style="color: #666;">📧 drey@want.co.na</span><br>
                  <span style="font-size: 13px; color: #999;">Status: PENDING | City: Windhoek</span>
                </div>

                <div class="email-item">
                  <strong>2. Ossie's Quality Cars</strong><br>
                  <span style="color: #666;">📧 oscar@ossiesqc.com</span><br>
                  <span style="font-size: 13px; color: #999;">Status: APPROVED | City: Windhoek</span>
                </div>

                <div class="email-item">
                  <strong>3. Betech Solutions</strong><br>
                  <span style="color: #666;">📧 gaapnamibia@gmail.com</span><br>
                  <span style="font-size: 13px; color: #999;">Status: APPROVED | City: Windhoek</span>
                </div>
              </div>

              <div class="success-box" style="border-left-color: #1F3469;">
                <h3 style="margin-top: 0; color: #1F3469;">📋 What Each Email Contains:</h3>
                <ul style="line-height: 1.8;">
                  <li>Personalized welcome message</li>
                  <li>Account status (Approved/Pending)</li>
                  <li>Feature overview and benefits</li>
                  <li>Direct link to dealer dashboard</li>
                  <li>Support contact information</li>
                  <li>Special welcome offer (5 free featured listings)</li>
                </ul>
              </div>

              <div style="background: white; border-radius: 8px; padding: 25px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1F3469;">🔔 Next Steps:</h3>
                <p>All dealerships will receive:</p>
                <ul style="line-height: 1.8;">
                  <li>✉️ Registration confirmation emails</li>
                  <li>📧 Welcome emails with full feature access</li>
                  <li>📬 Ongoing notifications for inquiries and activity</li>
                  <li>🎁 5 free featured listing credits</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 10px 0;"><strong>Cars.na Email System</strong></p>
              <p style="margin: 5px 0;">Automated Dealership Communications</p>
              <p style="margin: 15px 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Cars.na. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
✅ Welcome Email Campaign Complete!

Campaign Summary:
- Total Sent: 3 emails
- Success Rate: 100%
- Mail Server: smtp.stackmail.com
- Sent At: ${new Date().toLocaleString()}

Emails Sent To:

1. Want Media CC
   Email: drey@want.co.na
   Status: PENDING | City: Windhoek

2. Ossie's Quality Cars
   Email: oscar@ossiesqc.com
   Status: APPROVED | City: Windhoek

3. Betech Solutions
   Email: gaapnamibia@gmail.com
   Status: APPROVED | City: Windhoek

What Each Email Contains:
- Personalized welcome message
- Account status (Approved/Pending)
- Feature overview and benefits
- Direct link to dealer dashboard
- Support contact information
- Special welcome offer (5 free featured listings)

© ${new Date().getFullYear()} Cars.na - Namibia's Trusted Automotive Marketplace
      `.trim(),
    });

    console.log('✅ Sample email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendSampleEmail();
