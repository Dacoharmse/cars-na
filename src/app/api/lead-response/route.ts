import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, customerEmail, customerName, message, dealershipName } = body;

    if (!leadId || !customerEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, customerEmail, message' },
        { status: 400 }
      );
    }

    // Get the lead to verify it exists and get more details
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        vehicle: true,
        dealership: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Try to send email response to customer
    let emailSent = false;
    try {
      const smtpHost = process.env.SMTP_HOST || 'localhost';
      const config: any = {
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '25'),
        secure: process.env.SMTP_SECURE === 'true',
        tls: { rejectUnauthorized: false },
      };

      if (process.env.SMTP_REQUIRE_AUTH === 'true') {
        config.auth = {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        };
      }

      const transporter = nodemailer.createTransport(config);

      const vehicleInfo = lead.vehicle
        ? `<div style="background: #f0f9f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #16a34a;">
            <h4 style="margin: 0 0 10px 0; color: #16a34a;">Regarding Your Interest In</h4>
            <p style="margin: 0; color: #374151;">${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}</p>
          </div>`
        : '';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Response from ${dealershipName || lead.dealership?.name}</title>
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Response from ${dealershipName || lead.dealership?.name}</h1>
                <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">via Cars.na</p>
              </div>

              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">
                  Dear ${customerName},
                </p>
                <p style="color: #374151;">
                  Thank you for your inquiry. Here is our response:
                </p>

                ${vehicleInfo}

                <div style="background: #f8f9fa; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #374151; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                </div>

                <div style="margin-top: 25px; text-align: center;">
                  <p style="color: #6b7280; font-size: 14px;">
                    If you have any further questions, feel free to reply to this email or contact us directly.
                  </p>
                </div>
              </div>

              <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">This message was sent via Cars.na</p>
                <p style="margin: 10px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const textContent = `
Response from ${dealershipName || lead.dealership?.name}

Dear ${customerName},

Thank you for your inquiry. Here is our response:

${lead.vehicle ? `Regarding: ${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : ''}

${message}

---
If you have any further questions, feel free to reply to this email or contact us directly.

This message was sent via Cars.na
${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}
      `;

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || `"${dealershipName || lead.dealership?.name}" <no-reply@cars.na>`,
        to: customerEmail,
        replyTo: lead.dealership?.email || session.user.email,
        subject: `Re: Your Inquiry - ${dealershipName || lead.dealership?.name}`,
        html: htmlContent,
        text: textContent,
      });

      emailSent = true;
    } catch (emailError: any) {
      console.error('Failed to send email response:', emailError.message);
      // In development, we'll still mark as successful
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Email would have been sent to', customerEmail);
        emailSent = true;
      }
    }

    // Get the current user for sender info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    });

    // Save the message to the conversation thread
    const leadMessage = await prisma.leadMessage.create({
      data: {
        leadId: leadId,
        content: message,
        senderType: 'DEALERSHIP',
        senderName: user?.name || session.user.name || 'Dealership Staff',
        senderId: user?.id,
        emailSent: emailSent,
        emailSentAt: emailSent ? new Date() : null,
      },
    });

    // Update lead status to CONTACTED
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'CONTACTED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: emailSent ? 'Response sent successfully!' : 'Lead updated but email could not be sent.',
      emailSent,
      leadMessage,
    });
  } catch (error) {
    console.error('Error sending lead response:', error);
    return NextResponse.json(
      { error: 'Failed to send response' },
      { status: 500 }
    );
  }
}
