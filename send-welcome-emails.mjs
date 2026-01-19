import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envFile = readFileSync(resolve(__dirname, '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  }
});

const prisma = new PrismaClient();

// Email configuration
const config = {
  host: process.env.SMTP_HOST || 'smtp.stackmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'no-reply@cars.na',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
};

async function sendWelcomeEmails() {
  try {
    console.log('🔍 Fetching registered dealerships...\n');

    // Get all dealerships
    const dealerships = await prisma.dealership.findMany({
      include: {
        users: {
          take: 1,
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Found ${dealerships.length} dealerships\n`);

    if (dealerships.length === 0) {
      console.log('❌ No dealerships found to send emails to.');
      return;
    }

    // Create email transporter
    console.log('📧 Initializing email service...');
    const transporter = nodemailer.createTransport(config);
    await transporter.verify();
    console.log('✅ Email service ready\n');

    let successCount = 0;
    let failCount = 0;

    // Send welcome email to each dealership
    for (const dealership of dealerships) {
      const contactPerson = dealership.users[0]?.name || dealership.contactPerson || 'Team';
      const statusText = dealership.status === 'APPROVED' ? 'active and ready to use' : 'under review';
      const statusColor = dealership.status === 'APPROVED' ? '#109B4A' : '#FF9800';

      try {
        console.log(`📤 Sending welcome email to ${dealership.name} (${dealership.email})...`);

        const info = await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'Cars.na <no-reply@cars.na>',
          to: dealership.email,
          subject: `Welcome to Cars.na - ${dealership.name}`,
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
                  background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%);
                  color: white;
                  padding: 40px 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 700;
                }
                .content {
                  padding: 40px 30px;
                  background: #f9fafb;
                }
                .welcome-box {
                  background: white;
                  border-radius: 8px;
                  padding: 30px;
                  margin-bottom: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .status-badge {
                  display: inline-block;
                  padding: 8px 16px;
                  background: ${statusColor};
                  color: white;
                  border-radius: 20px;
                  font-weight: 600;
                  font-size: 14px;
                  margin: 10px 0;
                }
                .features {
                  background: white;
                  border-radius: 8px;
                  padding: 30px;
                  margin: 20px 0;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .feature-item {
                  display: flex;
                  align-items: start;
                  margin: 15px 0;
                  padding: 15px;
                  background: #f8f9fa;
                  border-radius: 6px;
                }
                .feature-icon {
                  min-width: 40px;
                  min-height: 40px;
                  background: #109B4A;
                  color: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  margin-right: 15px;
                }
                .cta-button {
                  display: inline-block;
                  padding: 16px 32px;
                  background: #1F3469;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 6px rgba(31, 52, 105, 0.3);
                }
                .cta-button:hover {
                  background: #3B4F86;
                }
                .footer {
                  text-align: center;
                  padding: 30px;
                  color: #666;
                  font-size: 13px;
                  background: #f9fafb;
                  border-radius: 0 0 8px 8px;
                }
                .highlight {
                  color: #1F3469;
                  font-weight: 600;
                }
                h2 {
                  color: #1F3469;
                  margin-top: 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🚗 Welcome to Cars.na</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Namibia's Premier Automotive Marketplace</p>
                </div>

                <div class="content">
                  <div class="welcome-box">
                    <h2>Hello ${contactPerson}! 👋</h2>
                    <p style="font-size: 16px; line-height: 1.8;">
                      Welcome to <strong>Cars.na</strong>! We're thrilled to have <span class="highlight">${dealership.name}</span>
                      join our growing community of trusted automotive dealers in Namibia.
                    </p>
                    <div class="status-badge">
                      Account Status: ${statusText.toUpperCase()}
                    </div>
                    <p style="margin-top: 20px;">
                      Your dealership profile is now <strong>${statusText}</strong>.
                      ${dealership.status === 'APPROVED'
                        ? 'You can start listing your vehicles and connecting with potential buyers right away!'
                        : 'Our team is reviewing your application and will approve it shortly.'}
                    </p>
                  </div>

                  <div class="features">
                    <h2>🎯 What You Can Do Now</h2>

                    <div class="feature-item">
                      <div class="feature-icon">🚗</div>
                      <div>
                        <strong style="display: block; margin-bottom: 5px; font-size: 16px;">List Your Vehicles</strong>
                        <span style="color: #666;">Upload unlimited vehicle listings with photos, specifications, and pricing.</span>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-icon">📊</div>
                      <div>
                        <strong style="display: block; margin-bottom: 5px; font-size: 16px;">Track Performance</strong>
                        <span style="color: #666;">Monitor views, inquiries, and leads with our comprehensive analytics dashboard.</span>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-icon">💬</div>
                      <div>
                        <strong style="display: block; margin-bottom: 5px; font-size: 16px;">Manage Inquiries</strong>
                        <span style="color: #666;">Receive and respond to customer inquiries directly through your dashboard.</span>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-icon">⭐</div>
                      <div>
                        <strong style="display: block; margin-bottom: 5px; font-size: 16px;">Feature Your Listings</strong>
                        <span style="color: #666;">Promote your best vehicles to reach more potential buyers.</span>
                      </div>
                    </div>

                    <div class="feature-item">
                      <div class="feature-icon">👥</div>
                      <div>
                        <strong style="display: block; margin-bottom: 5px; font-size: 16px;">Team Collaboration</strong>
                        <span style="color: #666;">Add multiple team members to manage your dealership account.</span>
                      </div>
                    </div>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://cars.na/dealer/dashboard" class="cta-button">
                      Access Your Dashboard →
                    </a>
                  </div>

                  <div class="welcome-box" style="background: #fffbeb; border-left: 4px solid #FF9800;">
                    <h3 style="margin-top: 0; color: #FF9800;">📚 Need Help Getting Started?</h3>
                    <p>
                      Our support team is here to help you make the most of Cars.na:
                    </p>
                    <ul style="line-height: 1.8;">
                      <li>📧 Email: <a href="mailto:support@cars.na" style="color: #1F3469;">support@cars.na</a></li>
                      <li>📱 Phone: +264 61 000 000</li>
                      <li>💬 Live Chat: Available on your dashboard</li>
                      <li>📖 Help Center: <a href="https://cars.na/help" style="color: #1F3469;">cars.na/help</a></li>
                    </ul>
                  </div>

                  <div class="welcome-box">
                    <h3 style="margin-top: 0;">🎁 Special Offer</h3>
                    <p style="font-size: 15px;">
                      As a welcome gift, your first <strong>5 featured listings are on us!</strong>
                      Promote your best vehicles and get noticed by thousands of car buyers across Namibia.
                    </p>
                  </div>
                </div>

                <div class="footer">
                  <p style="margin: 10px 0;"><strong>Cars.na</strong></p>
                  <p style="margin: 5px 0;">Namibia's Trusted Automotive Marketplace</p>
                  <p style="margin: 15px 0;">
                    <a href="https://cars.na" style="color: #1F3469; text-decoration: none; margin: 0 10px;">Website</a> |
                    <a href="https://cars.na/help" style="color: #1F3469; text-decoration: none; margin: 0 10px;">Help Center</a> |
                    <a href="https://cars.na/contact" style="color: #1F3469; text-decoration: none; margin: 0 10px;">Contact Us</a>
                  </p>
                  <p style="margin: 15px 0; color: #999; font-size: 12px;">
                    ${dealership.name} | ${dealership.city}, Namibia
                  </p>
                  <p style="margin: 5px 0; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} Cars.na. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
Welcome to Cars.na!

Hello ${contactPerson},

We're thrilled to have ${dealership.name} join our growing community of trusted automotive dealers in Namibia.

Account Status: ${statusText.toUpperCase()}

Your dealership profile is now ${statusText}. ${dealership.status === 'APPROVED'
  ? 'You can start listing your vehicles and connecting with potential buyers right away!'
  : 'Our team is reviewing your application and will approve it shortly.'}

What You Can Do Now:

🚗 List Your Vehicles - Upload unlimited vehicle listings with photos and specs
📊 Track Performance - Monitor views, inquiries, and leads with analytics
💬 Manage Inquiries - Respond to customer inquiries through your dashboard
⭐ Feature Your Listings - Promote your best vehicles to reach more buyers
👥 Team Collaboration - Add multiple team members to manage your account

Special Offer: Your first 5 featured listings are on us!

Access Your Dashboard: https://cars.na/dealer/dashboard

Need Help?
- Email: support@cars.na
- Phone: +264 61 000 000
- Help Center: https://cars.na/help

Best regards,
The Cars.na Team

© ${new Date().getFullYear()} Cars.na - Namibia's Trusted Automotive Marketplace
          `.trim(),
        });

        console.log(`✅ Email sent successfully to ${dealership.name}`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}\n`);
        successCount++;

      } catch (error) {
        console.error(`❌ Failed to send email to ${dealership.name}:`, error.message);
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Email Campaign Summary');
    console.log('='.repeat(60));
    console.log(`Total Dealerships: ${dealerships.length}`);
    console.log(`✅ Successfully Sent: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('='.repeat(60) + '\n');

    if (successCount > 0) {
      console.log('🎉 Welcome emails sent successfully!');
    }

  } catch (error) {
    console.error('❌ Error sending welcome emails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

sendWelcomeEmails();
