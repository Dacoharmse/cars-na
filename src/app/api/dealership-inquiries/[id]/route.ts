import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get a single inquiry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await prisma.dealershipInquiry.findUnique({
      where: { id: params.id },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            contactPerson: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Failed to fetch inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// PATCH - Update inquiry (mark as read, respond, change status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, response, status, readBy, respondedBy } = body;

    const inquiry = await prisma.dealershipInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    switch (action) {
      case 'markAsRead':
        updateData.isRead = true;
        updateData.readAt = new Date();
        updateData.readBy = readBy || 'admin';
        if (inquiry.status === 'NEW') {
          updateData.status = 'READ';
        }
        break;

      case 'markAsUnread':
        updateData.isRead = false;
        updateData.readAt = null;
        updateData.readBy = null;
        updateData.status = 'NEW';
        break;

      case 'respond':
        if (!response) {
          return NextResponse.json(
            { error: 'Response message is required' },
            { status: 400 }
          );
        }
        updateData.responded = true;
        updateData.respondedAt = new Date();
        updateData.respondedBy = respondedBy || 'admin';
        updateData.response = response;
        updateData.status = 'RESPONDED';
        break;

      case 'updateStatus':
        if (!status) {
          return NextResponse.json(
            { error: 'Status is required' },
            { status: 400 }
          );
        }
        updateData.status = status;
        break;

      case 'markAsSpam':
        updateData.status = 'SPAM';
        break;

      default:
        // Allow direct field updates
        if (status) updateData.status = status;
        if (response !== undefined) {
          updateData.response = response;
          updateData.responded = true;
          updateData.respondedAt = new Date();
        }
    }

    const updatedInquiry = await prisma.dealershipInquiry.update({
      where: { id: params.id },
      data: updateData,
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
    });

  } catch (error) {
    console.error('Failed to update inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await prisma.dealershipInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    await prisma.dealershipInquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });

  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
