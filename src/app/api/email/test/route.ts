import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to test email service
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address required' },
        { status: 400 }
      );
    }

    // Send test email
    const testUserData = {
      name: 'Test User',
      email: testEmail,
      id: 'test-user-id'
    };

    const result = await emailService.sendWelcomeEmail(testUserData);

    if (result) {
      return NextResponse.json(
        {
          success: true,
          message: `Test email sent successfully to ${testEmail}`,
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return email service configuration status
    return NextResponse.json({
      status: 'Email service test endpoint ready',
      configuration: {
        smtp_host: process.env.SMTP_HOST || 'Not configured',
        smtp_port: process.env.SMTP_PORT || 'Not configured',
        smtp_user: process.env.SMTP_USER || process.env.EMAIL_USER || 'Not configured',
        from_email: process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'Not configured',
        development_mode: process.env.NODE_ENV === 'development'
      },
      instructions: {
        test: 'POST to this endpoint with { "testEmail": "your-email@example.com" }',
        note: 'Admin authentication required'
      }
    });

  } catch (error) {
    console.error('Email test status error:', error);
    return NextResponse.json(
      { error: 'Email test service status check failed' },
      { status: 500 }
    );
  }
}