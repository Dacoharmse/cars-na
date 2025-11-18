import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// UPDATE dealership status or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const { action, status, reason } = body;

    console.log(`Admin ${session.user.email} performing action: ${action} on dealership ${params.id}`);
    console.log(`New status: ${status}, Reason: ${reason || 'N/A'}`);

    // Update the database
    const updatedDealership = await prisma.dealership.update({
      where: { id: params.id },
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
          dealershipId: params.id,
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
  { params }: { params: { id: string } }
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

    console.log(`Admin ${session.user.email} deleting dealership ${params.id}`);

    // Delete from the database (this will cascade delete related records)
    await prisma.dealership.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Dealership deleted successfully',
      dealership: {
        id: params.id,
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
