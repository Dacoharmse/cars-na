import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { withRateLimit, inquiryLimiter } from '@/lib/rate-limit';

// Escape user input before embedding in HTML email
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

interface InquiryFormData {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject?: string;
  message: string;
  dealershipId: string;
  vehicleId?: string;
  source?: string;
}

// POST - Create a new dealership inquiry
export async function POST(request: NextRequest) {
  return withRateLimit(request, { ...inquiryLimiter, endpoint: 'inquiry' }, async () => {
  try {
    const body: InquiryFormData = await request.json();
    const { senderName, senderEmail, senderPhone, subject, message, dealershipId, vehicleId, source } = body;

    // Validate required fields
    if (!senderName || !senderEmail || !message || !dealershipId) {
      return NextResponse.json(
        { error: 'Missing required fields: senderName, senderEmail, message, dealershipId' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Find the dealership
    const dealership = await prisma.dealership.findUnique({
      where: { id: dealershipId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        contactPerson: true,
      },
    });

    if (!dealership) {
      return NextResponse.json(
        { error: 'Dealership not found' },
        { status: 404 }
      );
    }

    // Get vehicle details if vehicleId is provided
    let vehicleDetails = null;
    if (vehicleId) {
      vehicleDetails = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          price: true,
        },
      });
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create the inquiry in the database
    const inquiry = await prisma.dealershipInquiry.create({
      data: {
        senderName,
        senderEmail,
        senderPhone: senderPhone || null,
        subject: subject || (vehicleDetails ? `Inquiry about ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}` : 'General Inquiry'),
        message,
        dealershipId,
        vehicleId: vehicleId || null,
        source: source || 'dealership_page',
        ipAddress,
        userAgent,
        status: 'NEW',
        isRead: false,
        emailSentToDealership: false,
      },
    });

    // Also create a Lead record so it appears in the Lead Manager
    try {
      const lead = await prisma.lead.create({
        data: {
          dealershipId,
          vehicleId: vehicleId || null,
          customerName: senderName,
          customerEmail: senderEmail,
          customerPhone: senderPhone || null,
          message: message,
          source: 'CONTACT_FORM',
          status: 'NEW',
        },
      });

      // Create the initial message in the conversation thread
      await prisma.leadMessage.create({
        data: {
          leadId: lead.id,
          content: message,
          senderType: 'CUSTOMER',
          senderName: senderName,
          senderId: null, // Customer doesn't have a user ID
        },
      });
    } catch (leadError) {
      // Lead creation is optional - don't fail if it doesn't work
      console.error('Failed to create lead record:', leadError);
    }

    // Try to send email notification to dealership
    let emailSent = false;
    try {
      const smtpHost = process.env.SMTP_HOST || 'localhost';
      const isLocalSmtp = smtpHost === 'localhost' || smtpHost === '127.0.0.1';
      const config: any = {
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '25'),
        secure: process.env.SMTP_SECURE === 'true',
        tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalSmtp },
      };

      if (process.env.SMTP_REQUIRE_AUTH === 'true') {
        config.auth = {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        };
      }

      const transporter = nodemailer.createTransport(config);

      const vehicleInfo = vehicleDetails
        ? `<div style="background: #f0f9f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #16a34a;">
            <h4 style="margin: 0 0 10px 0; color: #16a34a;">Vehicle of Interest</h4>
            <p style="margin: 0; color: #374151;">${esc(vehicleDetails.year)} ${esc(vehicleDetails.make)} ${esc(vehicleDetails.model)}</p>
            <p style="margin: 5px 0 0 0; color: #374151; font-weight: bold;">Price: N$ ${vehicleDetails.price?.toLocaleString() || 'Contact for price'}</p>
          </div>`
        : '';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Customer Inquiry</title>
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Customer Inquiry</h1>
                <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">via Cars.na</p>
              </div>

              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">
                  Hello ${esc(dealership.contactPerson || dealership.name)},
                </p>
                <p style="color: #374151;">
                  You have received a new inquiry through Cars.na. Here are the details:
                </p>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1F3469; margin-top: 0; margin-bottom: 15px;">Customer Information</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Name:</td>
                      <td style="padding: 8px 0; color: #374151;">${esc(senderName)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0; color: #374151;"><a href="mailto:${esc(senderEmail)}" style="color: #1F3469;">${esc(senderEmail)}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                      <td style="padding: 8px 0; color: #374151;">${senderPhone ? `<a href="tel:${esc(senderPhone)}" style="color: #1F3469;">${esc(senderPhone)}</a>` : 'Not provided'}</td>
                    </tr>
                  </table>
                </div>

                ${vehicleInfo}

                <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">Message:</h4>
                  <p style="color: #92400e; margin: 0; white-space: pre-wrap; line-height: 1.6;">${esc(message)}</p>
                </div>

                <div style="margin-top: 25px; text-align: center;">
                  <a href="mailto:${esc(senderEmail)}?subject=Re: ${encodeURIComponent(subject || 'Your inquiry on Cars.na')}"
                     style="display: inline-block; background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Reply to Customer
                  </a>
                  ${senderPhone ? `<a href="tel:${esc(senderPhone)}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-left: 10px;">Call Customer</a>` : ''}
                </div>
              </div>

              <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">This inquiry was received via Cars.na</p>
                <p style="margin: 10px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const textContent = `
New Customer Inquiry via Cars.na

Hello ${dealership.contactPerson || dealership.name},

You have received a new inquiry. Here are the details:

CUSTOMER INFORMATION:
Name: ${senderName}
Email: ${senderEmail}
Phone: ${senderPhone || 'Not provided'}

${vehicleDetails ? `VEHICLE OF INTEREST:
${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}
Price: N$ ${vehicleDetails.price?.toLocaleString() || 'Contact for price'}
` : ''}

MESSAGE:
${message}

---
This inquiry was received via Cars.na
${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}
      `;

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
        to: dealership.email,
        replyTo: senderEmail,
        subject: `New Inquiry: ${subject || 'Customer Inquiry'} - Cars.na`,
        html: htmlContent,
        text: textContent,
      });

      emailSent = true;

      // Update the inquiry to mark email as sent
      await prisma.dealershipInquiry.update({
        where: { id: inquiry.id },
        data: {
          emailSentToDealership: true,
          emailSentAt: new Date(),
        },
      });

    } catch (emailError: any) {
      console.error('Failed to send email notification:', emailError.message);
      // Continue even if email fails - the inquiry is saved in the database
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been sent successfully. The dealership will contact you soon!',
        inquiryId: inquiry.id,
        emailSent,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Dealership inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again.' },
      { status: 500 }
    );
  }
  }); // end withRateLimit
}

// GET - Fetch dealership inquiries (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '20');
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), 100);
    const status = searchParams.get('status');
    const dealershipId = searchParams.get('dealershipId');
    const isRead = searchParams.get('isRead');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    if (search) {
      where.OR = [
        { senderName: { contains: search, mode: 'insensitive' } },
        { senderEmail: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get inquiries with pagination
    const [inquiries, total, unreadCount] = await Promise.all([
      prisma.dealershipInquiry.findMany({
        where,
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.dealershipInquiry.count({ where }),
      prisma.dealershipInquiry.count({ where: { ...where, isRead: false } }),
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });

  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
