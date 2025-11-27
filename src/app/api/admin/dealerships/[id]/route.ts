import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// UPDATE dealership status or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, status, reason, isFeatured } = body;

    console.log(`Admin ${session.user.email} performing action: ${action} on dealership ${id}`);
    console.log(`New status: ${status}, Reason: ${reason || 'N/A'}, isFeatured: ${isFeatured}`);

    // Handle toggle-featured action
    if (action === 'toggle-featured') {
      const updatedDealership = await prisma.dealership.update({
        where: { id },
        data: {
          isFeatured: isFeatured,
          updatedAt: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        message: `Dealership ${isFeatured ? 'set as featured' : 'removed from featured'} successfully`,
        dealership: {
          id: updatedDealership.id,
          isFeatured: updatedDealership.isFeatured,
          updatedAt: updatedDealership.updatedAt.toISOString()
        }
      });
    }

    // Update the database for status changes
    const updatedDealership = await prisma.dealership.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        isVerified: status === 'APPROVED' ? true : false
      }
    });

    // If approving, also activate the dealer principal user
    if (status === 'APPROVED') {
      await prisma.user.updateMany({
        where: {
          dealershipId: id,
          role: 'DEALER_PRINCIPAL'
        },
        data: {
          status: 'ACTIVE',
          isActive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Dealership ${action}d successfully`,
      dealership: {
        id: updatedDealership.id,
        status: updatedDealership.status,
        updatedAt: updatedDealership.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating dealership:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update dealership'
      },
      { status: 500 }
    );
  }
}

// DELETE dealership
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    console.log(`Admin ${session.user.email} deleting dealership ${id}`);

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete leads first (not cascaded)
      await tx.lead.deleteMany({
        where: { dealershipId: id }
      });

      // Delete all vehicles (this will cascade delete VehicleImages and FeaturedListings)
      await tx.vehicle.deleteMany({
        where: { dealershipId: id }
      });

      // Delete dealership subscription
      await tx.dealershipSubscription.deleteMany({
        where: { dealershipId: id }
      });

      // Delete subscription notifications
      await tx.subscriptionNotification.deleteMany({
        where: { dealershipId: id }
      });

      // Delete usage analytics
      await tx.usageAnalytics.deleteMany({
        where: { dealershipId: id }
      });

      // Delete payments
      await tx.payment.deleteMany({
        where: { dealershipId: id }
      });

      // Delete users associated with the dealership (this will cascade delete Account, Session, UserAuditLog)
      await tx.user.deleteMany({
        where: { dealershipId: id }
      });

      // Finally, delete the dealership
      await tx.dealership.delete({
        where: { id }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Dealership deleted successfully',
      dealership: {
        id,
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error deleting dealership:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete dealership'
      },
      { status: 500 }
    );
  }
}
