/**
 * Email helper functions for Cars.na platform
 * Provides utility functions for sending emails throughout the application
 */

import { emailService, UserData } from './email';

// Email sending helper functions

export async function sendWelcomeEmail(userData: UserData) {
  try {
    const result = await emailService.sendWelcomeEmail(userData);
    console.log(`Welcome email sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendVerificationEmail(userData: UserData & { verificationToken: string }) {
  try {
    const result = await emailService.sendVerificationEmail(userData);
    console.log(`Verification email sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendLoginNotificationEmail(
  userData: UserData,
  loginDetails: {
    ip?: string;
    location?: string;
    device?: string;
    userAgent?: string;
  }
) {
  try {
    const result = await emailService.sendLoginNotification(userData, loginDetails);
    console.log(`Login notification sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send login notification:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(userData: UserData, resetToken: string) {
  try {
    const result = await emailService.sendPasswordResetEmail(userData, resetToken);
    console.log(`Password reset email sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

export async function sendDealerApprovalEmail(userData: UserData) {
  try {
    const result = await emailService.sendDealerApprovalEmail(userData);
    console.log(`Dealer approval email sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send dealer approval email:', error);
    return false;
  }
}

export async function sendVehicleInquiryEmail(
  dealerEmail: string,
  inquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
      price: number;
      dealerName: string;
    };
    message: string;
  }
) {
  try {
    const result = await emailService.sendVehicleInquiryNotification(dealerEmail, inquiryData);
    console.log(`Vehicle inquiry email sent to ${dealerEmail}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send vehicle inquiry email:', error);
    return false;
  }
}

export async function sendNewsletterEmail(
  userData: UserData,
  content: {
    subject: string;
    headline: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  }
) {
  try {
    const result = await emailService.sendNewsletterEmail(userData, content);
    console.log(`Newsletter email sent to ${userData.email}:`, result);
    return result;
  } catch (error) {
    console.error('Failed to send newsletter email:', error);
    return false;
  }
}

// Admin notification emails
export async function sendAdminNotificationEmail(
  subject: string,
  message: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cars.na';
    const adminUserData: UserData = {
      name: 'System Administrator',
      email: adminEmail,
      id: 'admin'
    };

    const priorityColors = {
      low: '#109B4A',
      medium: '#FFDD11',
      high: '#CB2030'
    };

    const priorityIcons = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨'
    };

    const content = {
      subject: `${priorityIcons[priority]} Cars.na Admin Alert: ${subject}`,
      headline: `${priorityIcons[priority]} Admin Notification`,
      message: `
        <div style="background: ${priorityColors[priority]}15; padding: 20px; border-radius: 8px; border-left: 4px solid ${priorityColors[priority]};">
          <h3 style="color: ${priorityColors[priority]}; margin-top: 0;">Priority: ${priority.toUpperCase()}</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 15px;">
            ${message}
          </div>
          <p style="margin-bottom: 0; font-size: 12px; color: #6b7280;">
            Generated at: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}
          </p>
        </div>
      `,
      ctaText: 'Access Admin Panel',
      ctaUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin-auth`
    };

    const result = await emailService.sendNewsletterEmail(adminUserData, content);
    console.log(`Admin notification sent: ${subject}`, result);
    return result;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
}

// Bulk email sending (for newsletters, announcements)
export async function sendBulkEmails(
  recipients: UserData[],
  content: {
    subject: string;
    headline: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  },
  batchSize: number = 10,
  delayBetweenBatches: number = 1000
) {
  const results: { email: string; success: boolean; error?: string }[] = [];

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    const batchPromises = batch.map(async (userData) => {
      try {
        const success = await emailService.sendNewsletterEmail(userData, content);
        return { email: userData.email, success };
      } catch (error) {
        console.error(`Failed to send email to ${userData.email}:`, error);
        return { email: userData.email, success: false, error: error.message };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`Bulk email completed: ${successCount} sent, ${failureCount} failed`);

  return {
    total: recipients.length,
    successful: successCount,
    failed: failureCount,
    results
  };
}

// Email template testing
export async function testEmailTemplate(
  templateType: 'welcome' | 'verification' | 'login_notification' | 'password_reset' | 'dealer_approval',
  testEmail: string
) {
  const testUserData: UserData = {
    name: 'Test User',
    email: testEmail,
    id: 'test-user-id',
    dealershipName: 'Test Dealership'
  };

  try {
    let result = false;

    switch (templateType) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(testUserData);
        break;

      case 'verification':
        result = await emailService.sendVerificationEmail({
          ...testUserData,
          verificationToken: 'test-verification-token'
        });
        break;

      case 'login_notification':
        result = await emailService.sendLoginNotification(testUserData, {
          ip: '192.168.1.1',
          location: 'Windhoek, Namibia',
          device: 'Chrome on Windows'
        });
        break;

      case 'password_reset':
        result = await emailService.sendPasswordResetEmail(testUserData, 'test-reset-token');
        break;

      case 'dealer_approval':
        result = await emailService.sendDealerApprovalEmail(testUserData);
        break;
    }

    return { success: result, templateType, testEmail };
  } catch (error) {
    console.error(`Failed to test ${templateType} template:`, error);
    return { success: false, templateType, testEmail, error: error.message };
  }
}

// Email validation utility
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Extract user data from various sources
export function extractUserDataFromSession(session: any): UserData {
  return {
    name: session.user?.name || 'User',
    email: session.user?.email || '',
    id: session.user?.id || '',
    dealershipId: session.user?.dealershipId
  };
}

export function extractUserDataFromDatabase(user: any): UserData {
  return {
    name: user.name || 'User',
    email: user.email || '',
    id: user.id || '',
    dealershipName: user.dealership?.name
  };
}