import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { email } = forgotPasswordSchema.parse(body);
    
    // Find user with this email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate password reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Update user with reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetExpires,
        },
      });
      
      // Send password reset email
      try {
        await emailService.sendPasswordResetEmail({
          name: user.name || 'User',
          email: user.email,
        }, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Return error if email fails
        return NextResponse.json(
          { error: 'Failed to send password reset email. Please try again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Password reset request failed. Please try again.' },
      { status: 500 }
    );
  }
}