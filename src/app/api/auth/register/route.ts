import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { z } from 'zod';

const registerSchema = z.object({
  // Business Information
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  
  // Contact Information
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  
  // Address Information
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal('')),
  
  // Account Information
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeToMarketing: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Generate email verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create user and dealership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create dealership
      const dealership = await tx.dealership.create({
        data: {
          name: validatedData.businessName,
          businessType: validatedData.businessType,
          registrationNumber: validatedData.registrationNumber,
          taxNumber: validatedData.taxNumber,
          contactPerson: validatedData.contactPerson,
          phone: validatedData.phone,
          alternatePhone: validatedData.alternatePhone,
          streetAddress: validatedData.streetAddress,
          city: validatedData.city,
          region: validatedData.region,
          postalCode: validatedData.postalCode,
          googleMapsUrl: validatedData.googleMapsUrl,
          status: 'PENDING', // Require admin approval
          isVerified: false,
        },
      });
      
      // Create user
      const user = await tx.user.create({
        data: {
          name: validatedData.contactPerson,
          email: validatedData.email,
          password: hashedPassword,
          role: 'DEALER',
          dealershipId: dealership.id,
          emailVerified: null, // Not verified yet
          verificationToken,
          verificationExpires,
        },
      });
      
      return { user, dealership };
    });
    
    // Send welcome and verification email
    try {
      await emailService.sendWelcomeEmail({
        name: validatedData.contactPerson,
        email: validatedData.email,
        dealershipName: validatedData.businessName,
      });
      
      await emailService.sendVerificationEmail({
        name: validatedData.contactPerson,
        email: validatedData.email,
      }, verificationToken);
    } catch (emailError) {
      console.error('Failed to send welcome/verification emails:', emailError);
      // Don't fail the registration if email fails
    }
    
    // Send dealer approval notification to admin
    try {
      await emailService.sendDealerApprovalNotification({
        dealershipName: validatedData.businessName,
        contactPerson: validatedData.contactPerson,
        email: validatedData.email,
        phone: validatedData.phone,
        businessType: validatedData.businessType,
        city: validatedData.city,
        dealershipId: result.dealership.id,
      });
    } catch (emailError) {
      console.error('Failed to send dealer approval notification:', emailError);
    }
    
    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email to verify your account.',
        userId: result.user.id,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}