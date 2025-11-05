import { NextRequest, NextResponse } from 'next/server';
import {
  notifyUserCreated,
  notifyUserSuspended,
  notifyUserReactivated,
  notifyDealershipApproved,
  notifyDealershipRejected,
  notifyDealershipSuspended
} from '@/lib/admin-email-notifications';
import {
  sendWelcomeEmail,
  sendCustomNotificationEmail,
  sendListingApprovedEmail,
  sendListingRejectedEmail,
  sendListingSuspendedEmail,
  sendListingDeletedEmail,
  sendListingUnderReviewEmail,
  sendListingReactivatedEmail
} from '@/lib/email-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userData, dealershipData, listingData, adminName, reason } = body;

    let result = false;

    switch (type) {
      case 'user_created':
        // Send welcome email to user
        await sendWelcomeEmail(userData);
        // Notify admin
        await notifyUserCreated(userData, adminName || 'System Administrator');
        result = true;
        break;

      case 'user_suspended':
        await notifyUserSuspended(
          userData,
          adminName || 'System Administrator',
          reason || 'No reason provided'
        );
        result = true;
        break;

      case 'user_reactivated':
        await notifyUserReactivated(
          userData,
          adminName || 'System Administrator'
        );
        result = true;
        break;

      case 'dealership_approved':
        await notifyDealershipApproved({
          name: dealershipData.name,
          contactPerson: dealershipData.contactPerson,
          email: dealershipData.email,
          city: dealershipData.city,
          approvedBy: adminName || 'System Administrator'
        });
        result = true;
        break;

      case 'dealership_rejected':
        await notifyDealershipRejected({
          name: dealershipData.name,
          contactPerson: dealershipData.contactPerson,
          email: dealershipData.email,
          rejectedBy: adminName || 'System Administrator',
          reason: reason || 'Application does not meet requirements'
        });
        result = true;
        break;

      case 'dealership_suspended':
        await notifyDealershipSuspended({
          name: dealershipData.name,
          contactPerson: dealershipData.contactPerson,
          email: dealershipData.email,
          suspendedBy: adminName || 'System Administrator',
          reason: reason || 'Policy violation'
        });
        result = true;
        break;

      case 'dealership_custom':
        // Send custom notification to dealership
        if (!dealershipData.email) {
          return NextResponse.json(
            { success: false, error: 'Dealership email is required' },
            { status: 400 }
          );
        }

        await sendCustomNotificationEmail(
          dealershipData.email,
          dealershipData.contactPerson,
          dealershipData.subject || 'Notification from Cars.na',
          dealershipData.message
        );
        result = true;
        break;

      case 'listing_approved':
        await sendListingApprovedEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          }
        );
        result = true;
        break;

      case 'listing_rejected':
        await sendListingRejectedEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          },
          reason || 'Does not meet listing requirements'
        );
        result = true;
        break;

      case 'listing_suspended':
        await sendListingSuspendedEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          },
          reason || 'Policy violation'
        );
        result = true;
        break;

      case 'listing_deleted':
        await sendListingDeletedEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          },
          reason || 'Removed by administrator'
        );
        result = true;
        break;

      case 'listing_under_review':
        await sendListingUnderReviewEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          }
        );
        result = true;
        break;

      case 'listing_reactivated':
        await sendListingReactivatedEmail(
          listingData.dealerEmail,
          listingData.dealerName,
          {
            title: listingData.title,
            make: listingData.make,
            model: listingData.model,
            year: listingData.year,
            price: listingData.price
          }
        );
        result = true;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result,
      message: `${type} notification sent successfully`
    });
  } catch (error) {
    console.error('Admin notification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send notification'
      },
      { status: 500 }
    );
  }
}
