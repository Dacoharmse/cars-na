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

console.log('🔍 Testing email configuration...\n');

// Log configuration (masking password)
console.log('SMTP Configuration:');
console.log(`  Host: ${process.env.SMTP_HOST}`);
console.log(`  Port: ${process.env.SMTP_PORT}`);
console.log(`  Secure: ${process.env.SMTP_SECURE}`);
console.log(`  User: ${process.env.SMTP_USER}`);
console.log(`  Password: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'}`);
console.log('');

// Try without auth first (for local SMTP server)
const config = {
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '25'),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  // Try without authentication for localhost
  ...(process.env.SMTP_HOST === 'localhost' ? {} : {
    auth: {
      user: process.env.SMTP_USER || 'no-reply@cars.na',
      pass: process.env.SMTP_PASS || '',
    },
  }),
};

async function testEmail() {
  try {
    console.log('📧 Creating transporter...');
    const transporter = nodemailer.createTransport(config);

    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    console.log('📤 Sending test email to dacoharmse13.dh@gmail.com...');
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'Cars.na <no-reply@cars.na>',
      to: 'dacoharmse13.dh@gmail.com',
      subject: 'Test Email from Cars.na - Email System Working',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #109B4A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .success { color: #109B4A; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email System Test</h1>
            </div>
            <div class="content">
              <h2 class="success">Success! Email system is working correctly</h2>
              <p>This is a test email from your Cars.na production website to verify that the email notification system is functioning properly.</p>

              <h3>Test Details:</h3>
              <ul>
                <li><strong>SMTP Server:</strong> ${config.host}</li>
                <li><strong>Port:</strong> ${config.port}</li>
                <li><strong>Secure Connection:</strong> ${config.secure ? 'Yes (SSL/TLS)' : 'No'}</li>
                <li><strong>From Email:</strong> ${process.env.FROM_EMAIL || 'no-reply@cars.na'}</li>
                <li><strong>Authentication:</strong> ${config.auth ? 'Yes' : 'No (Local SMTP)'}</li>
                <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>

              <p>Your email system is now ready to send:</p>
              <ul>
                <li>✉️ Dealer registration confirmations</li>
                <li>✉️ Admin notifications for new dealers</li>
                <li>✉️ User invitation emails</li>
                <li>✉️ Dealership approval notifications</li>
              </ul>

              <a href="https://cars.na" class="button">Visit Cars.na</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cars.na - Namibia's Leading Car Marketplace</p>
              <p>This is an automated test email from your production server</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Email System Test - Cars.na

Success! Your email system is working correctly.

This is a test email from your Cars.na production website to verify that the email notification system is functioning properly.

Test Details:
- SMTP Server: ${config.host}
- Port: ${config.port}
- Secure Connection: ${config.secure ? 'Yes (SSL/TLS)' : 'No'}
- From Email: ${process.env.FROM_EMAIL || 'no-reply@cars.na'}
- Authentication: ${config.auth ? 'Yes' : 'No (Local SMTP)'}
- Test Date: ${new Date().toLocaleString()}

Your email system is now ready to send dealer registration confirmations, admin notifications, user invitations, and dealership approval notifications.

Visit: https://cars.na

© ${new Date().getFullYear()} Cars.na - Namibia's Leading Car Marketplace
      `.trim(),
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📊 Response: ${info.response}`);
    console.log('\n✅ Email system is fully operational!\n');

    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    console.error('\nError details:', error.message);

    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Please check:');
      console.error('   - Username: no-reply@cars.na');
      console.error('   - Password: Verify it matches the mail server');
      console.error('   - Server: smtp.cars.na');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n⚠️  Connection failed. Please check:');
      console.error('   - SMTP server is accessible: smtp.cars.na');
      console.error('   - Port 465 is open');
      console.error('   - Firewall settings');
    }

    return false;
  }
}

testEmail().then(success => {
  process.exit(success ? 0 : 1);
});
