# Email System Setup Guide for Cars.na

## Overview

The Cars.na platform has a fully functional email system using **nodemailer** with support for multiple SMTP providers. All email templates are complete and ready to use with `no-reply@cars.na` as the sender address.

---

## Quick Setup Instructions

### Step 1: Configure Email Credentials

Update your `.env` file with the following email configuration:

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"              # Or your email provider's SMTP server
SMTP_PORT="587"                          # Usually 587 for TLS or 465 for SSL
SMTP_SECURE="false"                      # Set to "true" if using port 465
SMTP_USER="no-reply@cars.na"            # Your email address
SMTP_PASS="your-app-password-here"      # Your email password or app password
FROM_EMAIL="Cars.na <no-reply@cars.na>" # Sender name and email
ADMIN_EMAIL="admin@cars.na"              # Admin notification recipient
```

### Step 2: Email Provider-Specific Setup

#### Option 1: Gmail (Development/Testing)
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Generate an App Password: [App Passwords](https://myaccount.google.com/apppasswords)
4. Use the app password in `SMTP_PASS`

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@cars.na"
SMTP_PASS="xxxx xxxx xxxx xxxx"  # 16-character app password
FROM_EMAIL="Cars.na <no-reply@cars.na>"
```

#### Option 2: Outlook/Office 365
```env
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@cars.na"
SMTP_PASS="your-outlook-password"
FROM_EMAIL="Cars.na <no-reply@cars.na>"
```

#### Option 3: SendGrid (Recommended for Production)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key in Settings > API Keys
3. Verify your sender email domain

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="SG.your-sendgrid-api-key"
FROM_EMAIL="Cars.na <no-reply@cars.na>"
```

#### Option 4: Mailgun (Alternative Production Option)
1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Add and verify your domain
3. Get SMTP credentials from Domain Settings

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="postmaster@your-domain.com"
SMTP_PASS="your-mailgun-password"
FROM_EMAIL="Cars.na <no-reply@cars.na>"
```

#### Option 5: Custom SMTP Server
```env
SMTP_HOST="mail.cars.na"              # Your SMTP server
SMTP_PORT="587"                        # Your SMTP port
SMTP_SECURE="false"                    # true for SSL, false for TLS
SMTP_USER="no-reply@cars.na"          # Your email
SMTP_PASS="your-password"             # Your password
FROM_EMAIL="Cars.na <no-reply@cars.na>"
```

---

## Email Templates Available

### 1. User Communication Emails

#### Welcome Email
- Sent when: New user registers
- Purpose: Welcome new users and explain platform features
- Template: Professional branded welcome message
- Usage:
```typescript
import { sendWelcomeEmail } from '@/lib/email-helpers';
await sendWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com',
  id: 'user-123'
});
```

#### Email Verification
- Sent when: User needs to verify their email
- Purpose: Secure account verification with token
- Template: Verification link with security information
- Usage:
```typescript
import { sendVerificationEmail } from '@/lib/email-helpers';
await sendVerificationEmail({
  name: 'John Doe',
  email: 'john@example.com',
  id: 'user-123',
  verificationToken: 'secure-token-here'
});
```

#### Login Notification
- Sent when: User logs in from new device/location
- Purpose: Security alert for account protection
- Template: Login details with IP, location, device info
- Usage:
```typescript
import { sendLoginNotificationEmail } from '@/lib/email-helpers';
await sendLoginNotificationEmail(
  { name: 'John Doe', email: 'john@example.com' },
  {
    ip: '192.168.1.1',
    location: 'Windhoek, Namibia',
    device: 'Chrome on Windows'
  }
);
```

#### Password Reset
- Sent when: User requests password reset
- Purpose: Secure password reset with time-limited token
- Template: Reset link with security warnings
- Usage:
```typescript
import { sendPasswordResetEmail } from '@/lib/email-helpers';
await sendPasswordResetEmail(
  { name: 'John Doe', email: 'john@example.com' },
  'reset-token-here'
);
```

### 2. Dealer Communication Emails

#### Dealer Approval
- Sent when: Dealership application is approved
- Purpose: Notify dealer of approval and next steps
- Template: Congratulations message with dashboard access
- Usage:
```typescript
import { sendDealerApprovalEmail } from '@/lib/email-helpers';
await sendDealerApprovalEmail({
  name: 'Dealer Name',
  email: 'dealer@motors.na',
  dealershipName: 'Premium Motors'
});
```

#### Vehicle Inquiry
- Sent when: Customer inquires about a vehicle
- Purpose: Notify dealer of potential sale
- Template: Customer details and inquiry message
- Usage:
```typescript
import { sendVehicleInquiryEmail } from '@/lib/email-helpers';
await sendVehicleInquiryEmail('dealer@motors.na', {
  customerName: 'Jane Smith',
  customerEmail: 'jane@example.com',
  customerPhone: '+264 81 123 4567',
  vehicle: {
    make: 'Toyota',
    model: 'Hilux',
    year: 2023,
    price: 450000,
    dealerName: 'Premium Motors'
  },
  message: 'Interested in this vehicle'
});
```

### 3. Admin Notification Emails

#### User Management Notifications
```typescript
import {
  notifyUserCreated,
  notifyUserSuspended,
  notifyUserReactivated
} from '@/lib/admin-email-notifications';

// When user is created
await notifyUserCreated(userData, 'Admin Name');

// When user is suspended
await notifyUserSuspended(userData, 'Admin Name', 'Violation of terms');

// When user is reactivated
await notifyUserReactivated(userData, 'Admin Name');
```

#### Dealership Management Notifications
```typescript
import {
  notifyDealershipApproved,
  notifyDealershipRejected,
  notifyDealershipSuspended
} from '@/lib/admin-email-notifications';

// When dealership is approved
await notifyDealershipApproved({
  name: 'Premium Motors',
  contactPerson: 'John Dealer',
  email: 'john@premiummotors.na',
  city: 'Windhoek',
  approvedBy: 'Admin Name'
});
```

#### System Notifications
```typescript
import {
  notifySystemError,
  notifySecurityAlert,
  notifyHighTrafficAlert,
  sendDailySummaryEmail
} from '@/lib/admin-email-notifications';

// System error notification
await notifySystemError({
  error: 'Database connection failed',
  location: 'Vehicle API',
  userId: 'user-123',
  stackTrace: error.stack
});

// Security alert
await notifySecurityAlert({
  type: 'Multiple failed login attempts',
  description: 'User attempted 5 failed logins',
  severity: 'high',
  userId: 'user-123',
  ipAddress: '192.168.1.1'
});
```

### 4. Newsletter and Bulk Emails

#### Newsletter to All Users
```typescript
import { sendBulkEmails } from '@/lib/email-helpers';

const users = [
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' }
];

const content = {
  subject: 'Monthly Car Deals - December 2024',
  headline: 'Best Vehicle Deals This Month',
  message: '<p>Check out our latest vehicle offers and special discounts...</p>',
  ctaText: 'Browse All Deals',
  ctaUrl: 'https://cars.na/vehicles'
};

// Send in batches of 10 with 1 second delay
const result = await sendBulkEmails(users, content, 10, 1000);
console.log(`Sent ${result.successful} emails, ${result.failed} failed`);
```

---

## Integration with Admin Panel

### Automatic Email Notifications

To integrate email notifications with your admin panel user management actions, update [/src/app/admin/page.tsx](src/app/admin/page.tsx):

```typescript
import {
  notifyUserCreated,
  notifyUserSuspended,
  notifyUserReactivated
} from '@/lib/admin-email-notifications';

// In confirmSuspendUser function (around line 1283):
const confirmSuspendUser = async () => {
  if (suspendingUser) {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === suspendingUser.id
          ? { ...u, status: 'Suspended' }
          : u
      )
    );

    // Send suspension email notification
    await notifyUserSuspended(
      {
        name: suspendingUser.name,
        email: suspendingUser.email,
        id: suspendingUser.id
      },
      'System Administrator',
      suspendReason || 'No reason provided'
    );

    console.log('User suspended:', suspendingUser.name);
    setSuspendingUser(null);
    setSuspendReason('');
  }
};

// In confirmActivateUser function (around line 1298):
const confirmActivateUser = async () => {
  if (activatingUser) {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === activatingUser.id
          ? { ...u, status: 'Active' }
          : u
      )
    );

    // Send reactivation email notification
    await notifyUserReactivated(
      {
        name: activatingUser.name,
        email: activatingUser.email,
        id: activatingUser.id
      },
      'System Administrator'
    );

    console.log('User activated:', activatingUser.name);
    setActivatingUser(null);
  }
};

// In saveUserEdit function (around line 1313):
const saveUserEdit = async () => {
  if (editingUser) {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === editingUser.id
          ? { ...editingUser }
          : u
      )
    );

    // If this was a new user creation
    if (!users.find(u => u.id === editingUser.id)) {
      await notifyUserCreated(
        {
          name: editingUser.name,
          email: editingUser.email,
          id: editingUser.id
        },
        'System Administrator'
      );
    }

    console.log('User saved:', editingUser);
    setEditingUser(null);
  }
};
```

---

## Testing the Email System

### Method 1: Using API Endpoint

Test email sending via the API:

```bash
# Test email service connection
curl http://localhost:3000/api/email/test

# Send test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

### Method 2: Using Helper Function

Create a test script [/scripts/test-email.ts](scripts/test-email.ts):

```typescript
import { testEmailTemplate } from '@/lib/email-helpers';

async function testEmails() {
  const testEmail = 'your-test-email@example.com';

  console.log('Testing Welcome Email...');
  await testEmailTemplate('welcome', testEmail);

  console.log('Testing Verification Email...');
  await testEmailTemplate('verification', testEmail);

  console.log('Testing Login Notification...');
  await testEmailTemplate('login_notification', testEmail);

  console.log('Testing Password Reset...');
  await testEmailTemplate('password_reset', testEmail);

  console.log('Testing Dealer Approval...');
  await testEmailTemplate('dealer_approval', testEmail);

  console.log('All tests complete!');
}

testEmails();
```

Run with: `npx tsx scripts/test-email.ts`

### Method 3: Development Mode

In development, if SMTP is not configured, emails will be logged to the console instead of sent:

```
📧 EMAIL FALLBACK - Would send email to: user@example.com
📧 Subject: Welcome to Cars.na
📧 Content: Welcome to Cars.na, John Doe!
```

---

## Production Deployment Checklist

- [ ] **Set up production SMTP credentials** (SendGrid or Mailgun recommended)
- [ ] **Configure `no-reply@cars.na`** email address with your provider
- [ ] **Add SPF, DKIM, and DMARC records** to your DNS for email authentication
- [ ] **Set `ADMIN_EMAIL`** environment variable for admin notifications
- [ ] **Test all email templates** before going live
- [ ] **Configure rate limiting** to prevent abuse
- [ ] **Set up email monitoring** to track delivery rates
- [ ] **Create unsubscribe page** at `/unsubscribe` for newsletters
- [ ] **Add email logging** for audit trail
- [ ] **Set up bounce handling** for invalid email addresses

---

## Email Provider Recommendations

### For Development/Testing
- **Gmail** - Easy to set up with app passwords
- **Outlook** - Good alternative to Gmail
- **Mailtrap** - Email testing service (catches all emails)

### For Production
- **SendGrid** - 100 emails/day free, excellent deliverability
- **Mailgun** - 5,000 emails/month free, good API
- **Amazon SES** - Pay per use, highly scalable
- **Postmark** - Excellent for transactional emails

---

## Troubleshooting

### Issue: "Email service initialization failed"
**Solution:** Check SMTP credentials in `.env` file. Verify the host, port, user, and password are correct.

### Issue: "Authentication failed"
**Solution:**
- For Gmail: Use app password, not regular password
- For other providers: Verify credentials are correct
- Check if 2FA is enabled (may need app password)

### Issue: "Connection timeout"
**Solution:**
- Check firewall settings (ports 587 or 465 should be open)
- Try different SMTP port (587 for TLS, 465 for SSL)
- Verify SMTP server address is correct

### Issue: Emails going to spam
**Solution:**
- Set up SPF, DKIM, and DMARC records
- Use authenticated sender domain
- Avoid spam trigger words in subject/content
- Use professional email provider (SendGrid, Mailgun)

### Issue: Rate limiting errors
**Solution:**
- Implement delays between bulk emails
- Use batch sending (10-20 emails per batch)
- Upgrade to paid email service plan

---

## API Endpoints Reference

### Send Email
**POST** `/api/email/send`

Request body:
```json
{
  "type": "welcome",
  "to": "user@example.com",
  "userData": {
    "name": "John Doe",
    "email": "user@example.com",
    "id": "user-123"
  }
}
```

### Test Email Service
**POST** `/api/email/test`

Request body:
```json
{
  "testEmail": "test@example.com"
}
```

### Check Service Status
**GET** `/api/email/test`

Response:
```json
{
  "configured": true,
  "host": "smtp.gmail.com",
  "port": 587,
  "from": "Cars.na <no-reply@cars.na>"
}
```

---

## Need Help?

- Check the [EMAIL_SYSTEM_DOCUMENTATION.md](EMAIL_SYSTEM_DOCUMENTATION.md) for complete system documentation
- Review [/src/lib/email.ts](src/lib/email.ts) for email service implementation
- Check [/src/lib/email-helpers.ts](src/lib/email-helpers.ts) for helper functions
- See [/src/lib/admin-email-notifications.ts](src/lib/admin-email-notifications.ts) for admin notifications

---

**The email system is fully functional and ready to use once you configure the SMTP credentials!**
