import nodemailer from 'nodemailer';

// Try different possible mail server hosts
const possibleHosts = [
  'mail.cars.na',
  'my20.com',
  'smtp.my20.com',
  'mail.my20.com',
  'cars.na'
];

const config = {
  host: 'mail.cars.na',
  port: 587, // Try port 587 with STARTTLS instead of 465
  secure: false, // false for port 587 (will upgrade via STARTTLS)
  auth: {
    user: 'no-reply@cars.na',
    pass: 'no-reply@cars2025',
  },
  tls: {
    // Do not fail on invalid certs (for development/testing)
    rejectUnauthorized: false
  },
  requireTLS: true // Require STARTTLS
};

console.log('Email Configuration:');
console.log('- Host:', config.host);
console.log('- Port:', config.port);
console.log('- User:', config.auth.user);
console.log('- SSL:', config.secure);
console.log('\nInitializing email transporter...');

const transporter = nodemailer.createTransport(config);

try {
  console.log('Verifying SMTP connection...');
  await transporter.verify();
  console.log('✓ SMTP connection verified successfully');

  console.log('\nSending test email to dacoharmse13.dh@gmail.com...');
  const info = await transporter.sendMail({
    from: '"Cars.na Test" <no-reply@cars.na>',
    to: 'dacoharmse13.dh@gmail.com',
    subject: 'Cars.na Email System Test',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1F3469 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #1F3469; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Cars.na Email System Test</h1>
          </div>
          <div class="content">
            <h2>Email System Successfully Configured!</h2>
            <p>This is a test email from the Cars.na platform to verify that the email system is working correctly.</p>

            <p><strong>SMTP Configuration:</strong></p>
            <ul>
              <li>Host: smtp.cars.na</li>
              <li>Port: 465 (SSL)</li>
              <li>From: no-reply@cars.na</li>
            </ul>

            <p><strong>Email Functionality:</strong></p>
            <ul>
              <li>✓ Dealer Registration Confirmation</li>
              <li>✓ Dealer Approval Notification</li>
              <li>✓ Admin New Dealer Notification</li>
            </ul>

            <p>All dealership registration and approval emails are now being sent from <strong>no-reply@cars.na</strong>.</p>

            <a href="https://cars.na" class="button">Visit Cars.na</a>

            <div class="footer">
              <p>This is an automated test message from Cars.na</p>
              <p>© ${new Date().getFullYear()} Cars.na - All Rights Reserved</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Cars.na Email System Test

Email System Successfully Configured!

This is a test email from the Cars.na platform to verify that the email system is working correctly.

SMTP Configuration:
- Host: smtp.cars.na
- Port: 465 (SSL)
- From: no-reply@cars.na

Email Functionality:
✓ Dealer Registration Confirmation
✓ Dealer Approval Notification
✓ Admin New Dealer Notification

All dealership registration and approval emails are now being sent from no-reply@cars.na.

Visit Cars.na at https://cars.na

---
This is an automated test message from Cars.na
© ${new Date().getFullYear()} Cars.na - All Rights Reserved
    `,
  });

  console.log('✓ Test email sent successfully!');
  console.log('Message ID:', info.messageId);
  console.log('Recipient:', 'dacoharmse13.dh@gmail.com');
  console.log('\nPlease check the inbox (and spam folder) for the test email.');

} catch (error) {
  console.error('✗ Email test failed:', error.message);
  if (error.code) {
    console.error('Error code:', error.code);
  }
  if (error.response) {
    console.error('Server response:', error.response);
  }
  process.exit(1);
}
