import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VehicleCategory } from '@prisma/client';
import nodemailer from 'nodemailer';
import { withRateLimit, sellVehicleLimiter } from '@/lib/rate-limit';

// Helper function to check auto-moderate setting (reads from PlatformSettings DB table)
async function isAutoModerateEnabled(): Promise<boolean> {
  try {
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'auto-moderate' },
    });
    if (!setting) return false;
    const value = setting.value as { enabled?: boolean };
    return value.enabled ?? false;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, { ...sellVehicleLimiter, endpoint: 'sell-vehicle' }, async () => {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const {
      category,
      make,
      model,
      year,
      mileage,
      condition,
      price,
      negotiable,
      color,
      transmission,
      fuelType,
      vin,
      registrationNo,
      city,
      region,
      description,
      images,
      hasAccident,
      serviceHistory,
      numberOfOwners,
      reason,
      availableForTest,
      userName,
      userEmail,
      userPhone,
    } = body;

    // Validate required fields
    if (!category || !make || !model || !year || !price || !description || !userName || !userEmail || !userPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(VehicleCategory).includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle category' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const parsedYear = parseInt(year);
    const parsedPrice = parseFloat(price);
    const parsedMileage = mileage != null && mileage !== '' ? parseInt(mileage) : null;
    const currentYear = new Date().getFullYear();

    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: `Year must be between 1900 and ${currentYear + 1}` },
        { status: 400 }
      );
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 999_999_999) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (parsedMileage !== null && (isNaN(parsedMileage) || parsedMileage < 0 || parsedMileage > 9_999_999)) {
      return NextResponse.json(
        { success: false, error: 'Mileage must be a non-negative number' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check auto-moderate setting
    const autoModerateEnabled = await isAutoModerateEnabled();
    const initialStatus = autoModerateEnabled ? 'APPROVED' : 'PENDING';

    // Create the listing
    const listing = await prisma.userVehicleListing.create({
      data: {
        userId: session?.user?.id || null,
        userName,
        userEmail,
        userPhone,
        category,
        make,
        model,
        year: parsedYear,
        mileage: parsedMileage,
        condition,
        price: parsedPrice,
        negotiable: negotiable ?? true,
        color: color || null,
        transmission: transmission || null,
        fuelType: fuelType || null,
        vin: vin || null,
        registrationNo: registrationNo || null,
        city: city || null,
        region: region || null,
        description,
        images: images || [],
        hasAccident: hasAccident ?? false,
        serviceHistory: serviceHistory ?? false,
        numberOfOwners: numberOfOwners ? parseInt(numberOfOwners) : null,
        reason: reason || null,
        availableForTest: availableForTest ?? true,
        status: initialStatus,
      },
    });

    // Send approval email if auto-approved
    if (autoModerateEnabled) {
      try {
        const { emailService } = await import('@/lib/email');
        await emailService.sendListingApprovedToSeller({
          sellerName: userName,
          sellerEmail: userEmail,
          vehicleDetails: {
            year: parseInt(year),
            make,
            model,
            category,
          },
        });
      } catch (emailError) {
        console.error('Failed to send auto-approval email:', emailError);
      }
    }

    // Create notifications for ALL approved dealerships about the new private listing
    try {
      const dealerships = await prisma.dealership.findMany({
        where: {
          status: 'APPROVED',
        },
        include: {
          users: {
            where: {
              role: {
                in: ['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'],
              },
            },
            select: {
              id: true,
            },
          },
        },
      });

      // Create notifications for all dealer users (batch insert to avoid N+1)
      const notificationData = dealerships.flatMap(dealership =>
        dealership.users.map(user => ({
          userId: user.id,
          type: 'NEW_LISTING',
          title: 'New Private Vehicle Listing',
          message: `A new ${year} ${make} ${model} has been listed for sale${city ? ` in ${city}` : ''} by a private seller for N$ ${parseFloat(price).toLocaleString()}.`,
          link: `/dealer/dashboard`,
          metadata: {
            listingId: listing.id,
            category: category,
            make: make,
            model: model,
            year: year,
            price: price,
            sellerName: userName,
            sellerLocation: city || region || 'Unknown',
          },
        }))
      );

      if (notificationData.length > 0) {
        await prisma.notification.createMany({ data: notificationData, skipDuplicates: true });
      }

      // Send email notifications to all dealerships
      const smtpHost = process.env.SMTP_HOST || 'localhost';
      const isLocalSmtp = smtpHost === 'localhost' || smtpHost === '127.0.0.1';
      const emailConfig: any = {
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '25'),
        secure: process.env.SMTP_SECURE === 'true',
        tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' && !isLocalSmtp },
      };

      if (process.env.SMTP_REQUIRE_AUTH === 'true') {
        emailConfig.auth = {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        };
      }

      const transporter = nodemailer.createTransport(emailConfig);

      // HTML-escape helper to prevent injection in email templates
      const esc = (s: unknown) =>
        String(s ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');

      // Send email to each dealership
      const emailPromises = dealerships
        .filter(d => d.email) // Only send to dealerships with email
        .map(dealership => {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>New Private Vehicle Listing</title>
              </head>
              <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🚗 New Private Vehicle Listing</h1>
                    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0;">A potential acquisition opportunity via Cars.na</p>
                  </div>

                  <div style="padding: 30px;">
                    <p style="color: #374151; font-size: 16px; margin-top: 0;">
                      Hello ${esc(dealership.contactPerson || dealership.name)},
                    </p>
                    <p style="color: #374151;">
                      A private seller has listed a vehicle for sale on Cars.na. This could be a great opportunity for your dealership!
                    </p>

                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                      <h3 style="color: #92400e; margin: 0 0 15px 0;">Vehicle Details</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Vehicle:</td>
                          <td style="padding: 8px 0; color: #374151; font-weight: bold;">${esc(parsedYear)} ${esc(make)} ${esc(model)}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Asking Price:</td>
                          <td style="padding: 8px 0; color: #16a34a; font-weight: bold; font-size: 18px;">N$ ${parsedPrice.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Category:</td>
                          <td style="padding: 8px 0; color: #374151;">${esc(category)}</td>
                        </tr>
                        ${parsedMileage !== null ? `<tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Mileage:</td>
                          <td style="padding: 8px 0; color: #374151;">${parsedMileage.toLocaleString()} km</td>
                        </tr>` : ''}
                        ${condition ? `<tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Condition:</td>
                          <td style="padding: 8px 0; color: #374151;">${esc(condition)}</td>
                        </tr>` : ''}
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Location:</td>
                          <td style="padding: 8px 0; color: #374151;">${esc(city || region || 'Not specified')}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <h4 style="color: #374151; margin: 0 0 10px 0;">Seller Contact</h4>
                      <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${esc(userName)}</p>
                      <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> <a href="tel:${esc(userPhone)}" style="color: #1F3469;">${esc(userPhone)}</a></p>
                      <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> <a href="mailto:${esc(userEmail)}" style="color: #1F3469;">${esc(userEmail)}</a></p>
                    </div>

                    <div style="margin-top: 25px; text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL || 'https://cars.na'}/admin?tab=sell-your-car"
                         style="display: inline-block; background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        View All Private Listings
                      </a>
                    </div>

                    <p style="color: #6b7280; font-size: 14px; margin-top: 25px; text-align: center;">
                      Express interest early to secure this vehicle before other dealerships!
                    </p>
                  </div>

                  <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
                    <p style="margin: 0;">This notification was sent via Cars.na</p>
                    <p style="margin: 10px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek', dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                </div>
              </body>
            </html>
          `;

          return transporter.sendMail({
            from: process.env.FROM_EMAIL || '"Cars.na" <no-reply@cars.na>',
            to: dealership.email,
            subject: `New Private Listing: ${parsedYear} ${make} ${model} - N$ ${parsedPrice.toLocaleString()}`,
            html: htmlContent,
          }).catch(err => {
            console.error(`Failed to send email to ${dealership.email}:`, err.message);
          });
        });

      await Promise.all(emailPromises);
      console.log(`Sent notifications to ${dealerships.length} dealerships for new private listing`);
    } catch (notifyError) {
      // Don't fail the listing creation if notifications fail
      console.error('Error sending dealership notifications:', notifyError);
    }

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        status: listing.status,
      },
      message: autoModerateEnabled
        ? 'Your listing has been automatically approved and is now visible to dealerships!'
        : 'Your listing has been submitted and is pending approval.',
    });
  } catch (error) {
    console.error('Error creating vehicle listing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
  }); // end withRateLimit
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's listings
    const listings = await prisma.userVehicleListing.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
