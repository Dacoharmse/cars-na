/**
 * Admin email notification hooks for Cars.na
 * Sends notifications when important admin actions occur
 */

import { sendAdminNotificationEmail, sendDealerApprovalEmail, sendWelcomeEmail } from './email-helpers';
import { UserData } from './email';

// User management notifications
export async function notifyUserCreated(userData: UserData, createdBy: string) {
  try {
    // Send welcome email to new user
    await sendWelcomeEmail(userData);

    // Notify admin of new user creation
    await sendAdminNotificationEmail(
      'New User Created',
      `
        <p>A new user has been created on the platform:</p>
        <ul>
          <li><strong>Name:</strong> ${userData.name}</li>
          <li><strong>Email:</strong> ${userData.email}</li>
          <li><strong>Created by:</strong> ${createdBy}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'low'
    );

    console.log('User creation notifications sent successfully');
  } catch (error) {
    console.error('Failed to send user creation notifications:', error);
  }
}

export async function notifyUserSuspended(userData: UserData, suspendedBy: string, reason?: string) {
  try {
    await sendAdminNotificationEmail(
      'User Suspended',
      `
        <p>A user has been suspended:</p>
        <ul>
          <li><strong>User:</strong> ${userData.name} (${userData.email})</li>
          <li><strong>Suspended by:</strong> ${suspendedBy}</li>
          <li><strong>Reason:</strong> ${reason || 'No reason provided'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'medium'
    );

    console.log('User suspension notification sent successfully');
  } catch (error) {
    console.error('Failed to send user suspension notification:', error);
  }
}

export async function notifyUserReactivated(userData: UserData, reactivatedBy: string) {
  try {
    await sendAdminNotificationEmail(
      'User Reactivated',
      `
        <p>A suspended user has been reactivated:</p>
        <ul>
          <li><strong>User:</strong> ${userData.name} (${userData.email})</li>
          <li><strong>Reactivated by:</strong> ${reactivatedBy}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'low'
    );

    console.log('User reactivation notification sent successfully');
  } catch (error) {
    console.error('Failed to send user reactivation notification:', error);
  }
}

// Dealership management notifications
export async function notifyDealershipApproved(dealershipData: {
  name: string;
  contactPerson: string;
  email: string;
  city: string;
  approvedBy: string;
}) {
  try {
    // Send approval email to dealer
    const userData: UserData = {
      name: dealershipData.contactPerson,
      email: dealershipData.email,
      dealershipName: dealershipData.name
    };

    await sendDealerApprovalEmail(userData);

    // Notify admin of approval
    await sendAdminNotificationEmail(
      'Dealership Approved',
      `
        <p>A dealership has been approved:</p>
        <ul>
          <li><strong>Dealership:</strong> ${dealershipData.name}</li>
          <li><strong>Contact Person:</strong> ${dealershipData.contactPerson}</li>
          <li><strong>Email:</strong> ${dealershipData.email}</li>
          <li><strong>Location:</strong> ${dealershipData.city}</li>
          <li><strong>Approved by:</strong> ${dealershipData.approvedBy}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'medium'
    );

    console.log('Dealership approval notifications sent successfully');
  } catch (error) {
    console.error('Failed to send dealership approval notifications:', error);
  }
}

export async function notifyDealershipRejected(dealershipData: {
  name: string;
  contactPerson: string;
  email: string;
  rejectedBy: string;
  reason?: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Dealership Rejected',
      `
        <p>A dealership application has been rejected:</p>
        <ul>
          <li><strong>Dealership:</strong> ${dealershipData.name}</li>
          <li><strong>Contact Person:</strong> ${dealershipData.contactPerson}</li>
          <li><strong>Email:</strong> ${dealershipData.email}</li>
          <li><strong>Rejected by:</strong> ${dealershipData.rejectedBy}</li>
          <li><strong>Reason:</strong> ${dealershipData.reason || 'No reason provided'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'medium'
    );

    console.log('Dealership rejection notification sent successfully');
  } catch (error) {
    console.error('Failed to send dealership rejection notification:', error);
  }
}

export async function notifyDealershipSuspended(dealershipData: {
  name: string;
  contactPerson: string;
  email: string;
  suspendedBy: string;
  reason?: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Dealership Suspended',
      `
        <p>A dealership has been suspended:</p>
        <ul>
          <li><strong>Dealership:</strong> ${dealershipData.name}</li>
          <li><strong>Contact Person:</strong> ${dealershipData.contactPerson}</li>
          <li><strong>Email:</strong> ${dealershipData.email}</li>
          <li><strong>Suspended by:</strong> ${dealershipData.suspendedBy}</li>
          <li><strong>Reason:</strong> ${dealershipData.reason || 'No reason provided'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'high'
    );

    console.log('Dealership suspension notification sent successfully');
  } catch (error) {
    console.error('Failed to send dealership suspension notification:', error);
  }
}

// Vehicle management notifications
export async function notifyVehicleFlagged(vehicleData: {
  make: string;
  model: string;
  year: number;
  dealershipName: string;
  flaggedBy: string;
  reason: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Vehicle Flagged for Review',
      `
        <p>A vehicle listing has been flagged for review:</p>
        <ul>
          <li><strong>Vehicle:</strong> ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}</li>
          <li><strong>Dealership:</strong> ${vehicleData.dealershipName}</li>
          <li><strong>Flagged by:</strong> ${vehicleData.flaggedBy}</li>
          <li><strong>Reason:</strong> ${vehicleData.reason}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
        <p>Please review this listing in the admin panel.</p>
      `,
      'medium'
    );

    console.log('Vehicle flagged notification sent successfully');
  } catch (error) {
    console.error('Failed to send vehicle flagged notification:', error);
  }
}

export async function notifyVehicleRemoved(vehicleData: {
  make: string;
  model: string;
  year: number;
  dealershipName: string;
  removedBy: string;
  reason: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Vehicle Listing Removed',
      `
        <p>A vehicle listing has been removed:</p>
        <ul>
          <li><strong>Vehicle:</strong> ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}</li>
          <li><strong>Dealership:</strong> ${vehicleData.dealershipName}</li>
          <li><strong>Removed by:</strong> ${vehicleData.removedBy}</li>
          <li><strong>Reason:</strong> ${vehicleData.reason}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
      `,
      'medium'
    );

    console.log('Vehicle removal notification sent successfully');
  } catch (error) {
    console.error('Failed to send vehicle removal notification:', error);
  }
}

// System notifications
export async function notifySystemError(errorData: {
  error: string;
  location: string;
  userId?: string;
  stackTrace?: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'System Error Detected',
      `
        <p>A system error has been detected:</p>
        <ul>
          <li><strong>Error:</strong> ${errorData.error}</li>
          <li><strong>Location:</strong> ${errorData.location}</li>
          <li><strong>User ID:</strong> ${errorData.userId || 'Anonymous'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
        ${errorData.stackTrace ? `
          <details>
            <summary>Stack Trace</summary>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${errorData.stackTrace}</pre>
          </details>
        ` : ''}
        <p>Please investigate this error immediately.</p>
      `,
      'high'
    );

    console.log('System error notification sent successfully');
  } catch (error) {
    console.error('Failed to send system error notification:', error);
  }
}

export async function notifyHighTrafficAlert(trafficData: {
  currentUsers: number;
  threshold: number;
  timeWindow: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'High Traffic Alert',
      `
        <p>High traffic detected on the platform:</p>
        <ul>
          <li><strong>Current Users:</strong> ${trafficData.currentUsers}</li>
          <li><strong>Threshold:</strong> ${trafficData.threshold}</li>
          <li><strong>Time Window:</strong> ${trafficData.timeWindow}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
        <p>Consider monitoring system performance and scaling if necessary.</p>
      `,
      'medium'
    );

    console.log('High traffic alert sent successfully');
  } catch (error) {
    console.error('Failed to send high traffic alert:', error);
  }
}

// Security notifications
export async function notifySecurityAlert(alertData: {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  userId?: string;
  ipAddress?: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Security Alert',
      `
        <p>A security alert has been triggered:</p>
        <ul>
          <li><strong>Alert Type:</strong> ${alertData.type}</li>
          <li><strong>Severity:</strong> ${alertData.severity.toUpperCase()}</li>
          <li><strong>Description:</strong> ${alertData.description}</li>
          <li><strong>User ID:</strong> ${alertData.userId || 'Unknown'}</li>
          <li><strong>IP Address:</strong> ${alertData.ipAddress || 'Unknown'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Windhoek' })}</li>
        </ul>
        <p>Please investigate this security incident immediately.</p>
      `,
      alertData.severity
    );

    console.log('Security alert notification sent successfully');
  } catch (error) {
    console.error('Failed to send security alert notification:', error);
  }
}

// Daily summary notifications
export async function sendDailySummaryEmail(summaryData: {
  newUsers: number;
  newDealerships: number;
  newVehicles: number;
  newInquiries: number;
  flaggedContent: number;
  date: string;
}) {
  try {
    await sendAdminNotificationEmail(
      'Daily Platform Summary',
      `
        <h3>Cars.na Daily Summary - ${summaryData.date}</h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
          <div style="background: #f0f9f5; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; color: #109B4A;">New Users</h4>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #109B4A;">${summaryData.newUsers}</p>
          </div>

          <div style="background: #f0f4ff; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; color: #1F3469;">New Dealerships</h4>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #1F3469;">${summaryData.newDealerships}</p>
          </div>

          <div style="background: #fff4e5; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; color: #FF8A00;">New Vehicles</h4>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #FF8A00;">${summaryData.newVehicles}</p>
          </div>

          <div style="background: #f0f9f5; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; color: #2EBA6A;">New Inquiries</h4>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #2EBA6A;">${summaryData.newInquiries}</p>
          </div>

          ${summaryData.flaggedContent > 0 ? `
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; color: #CB2030;">Flagged Content</h4>
            <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #CB2030;">${summaryData.flaggedContent}</p>
          </div>
          ` : ''}
        </div>

        <p>Have a great day managing the Cars.na platform!</p>
      `,
      'low'
    );

    console.log('Daily summary email sent successfully');
  } catch (error) {
    console.error('Failed to send daily summary email:', error);
  }
}