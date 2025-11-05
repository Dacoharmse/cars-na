import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // In a real app, update the database
    // Example with Prisma:
    // const updatedDealership = await prisma.dealership.update({
    //   where: { id: params.id },
    //   data: {
    //     status,
    //     updatedAt: new Date(),
    //     ...(reason && { suspensionReason: reason })
    //   }
    // });

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: `Dealership ${action}d successfully`,
      dealership: {
        id: params.id,
        status,
        updatedAt: new Date().toISOString()
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

    // In a real app, delete from the database
    // Example with Prisma:
    // await prisma.dealership.delete({
    //   where: { id: params.id }
    // });

    // Mock successful response
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
