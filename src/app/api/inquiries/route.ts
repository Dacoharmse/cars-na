import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { z } from 'zod';

const inquirySchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const data = inquirySchema.parse(body);
    
    // Get vehicle and dealership details
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      include: {
        dealership: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        message: data.message,
        vehicleId: data.vehicleId,
        dealershipId: vehicle.dealershipId,
        source: 'WEBSITE',
        status: 'NEW',
      },
    });
    
    // Send vehicle inquiry notification to dealer
    if (vehicle.dealership) {
      try {
        // Get dealer contact email (use dealership users)
        const dealerUsers = await prisma.user.findMany({
          where: {
            dealershipId: vehicle.dealershipId,
            role: 'DEALER',
          },
          take: 1,
        });
        
        const dealerEmail = dealerUsers[0]?.email;
        
        if (dealerEmail) {
          await emailService.sendVehicleInquiryNotification({
            dealerName: vehicle.dealership.contactPerson || 'Dealer',
            dealerEmail: dealerEmail,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone || 'Not provided',
            vehicleDetails: {
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              id: vehicle.id,
            },
            message: data.message || 'Customer is interested in this vehicle.',
          });
        }
      } catch (emailError) {
        console.error('Failed to send vehicle inquiry notification:', emailError);
        // Don't fail the inquiry if email fails
      }
    }
    
    return NextResponse.json({
      message: 'Your inquiry has been sent successfully! The dealer will contact you soon.',
      leadId: lead.id,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Inquiry creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}