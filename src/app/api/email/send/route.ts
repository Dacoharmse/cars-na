import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Types for email sending
interface SendEmailRequest {
  type: 'welcome' | 'verification' | 'login_notification' | 'password_reset' | 'dealer_approval' | 'vehicle_inquiry' | 'newsletter';
  to: string;
  userData?: {
    name: string;
    email: string;
    id?: string;
    dealershipName?: string;
    verificationToken?: string;
  };
  additionalData?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated (for most email types) or allow public for certain types
    const body: SendEmailRequest = await request.json();

    // Allow public access for verification and password reset emails
    const publicEmailTypes = ['verification', 'password_reset', 'vehicle_inquiry'];

    if (!publicEmailTypes.includes(body.type) && !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Admin-only email types
    const adminOnlyTypes = ['dealer_approval', 'newsletter'];
    if (adminOnlyTypes.includes(body.type) && session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { type, to, userData, additionalData } = body;

    if (!to || !userData) {
      return NextResponse.json(
        { error: 'Missing required fields: to, userData' },
        { status: 400 }
      );
    }

    let result = false;

    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(userData);
        break;

      case 'verification':
        if (!userData.verificationToken) {
          return NextResponse.json(
            { error: 'Verification token required' },
            { status: 400 }
          );
        }
        result = await emailService.sendVerificationEmail(userData);
        break;

      case 'login_notification':
        const loginDetails = additionalData?.loginDetails || {};
        result = await emailService.sendLoginNotification(userData, loginDetails);
        break;

      case 'password_reset':
        if (!additionalData?.resetToken) {
          return NextResponse.json(
            { error: 'Reset token required' },
            { status: 400 }
          );
        }
        result = await emailService.sendPasswordResetEmail(userData, additionalData.resetToken);
        break;

      case 'dealer_approval':
        result = await emailService.sendDealerApprovalEmail(userData);
        break;

      case 'vehicle_inquiry':
        if (!additionalData?.inquiryData) {
          return NextResponse.json(
            { error: 'Inquiry data required' },
            { status: 400 }
          );
        }
        result = await emailService.sendVehicleInquiryNotification(to, additionalData.inquiryData);
        break;

      case 'newsletter':
        if (!additionalData?.content) {
          return NextResponse.json(
            { error: 'Newsletter content required' },
            { status: 400 }
          );
        }
        result = await emailService.sendNewsletterEmail(userData, additionalData.content);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json(
        { success: true, message: `Email sent successfully to ${to}` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing email service status
export async function GET() {
  try {
    return NextResponse.json({
      status: 'Email service running',
      timestamp: new Date().toISOString(),
      config: {
        host: process.env.SMTP_HOST || 'Not configured',
        port: process.env.SMTP_PORT || 'Not configured',
        user: process.env.SMTP_USER || process.env.EMAIL_USER || 'Not configured',
        development_mode: process.env.NODE_ENV === 'development'
      }
    });
  } catch (error) {
    console.error('Email service status error:', error);
    return NextResponse.json(
      { error: 'Email service status check failed' },
      { status: 500 }
    );
  }
}