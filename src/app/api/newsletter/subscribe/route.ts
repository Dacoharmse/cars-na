import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { email, name } = subscribeSchema.parse(body);
    
    // Send newsletter subscription email
    try {
      await emailService.sendNewsletterEmail({
        name,
        email,
      }, {
        subject: 'Welcome to Cars.na Newsletter!',
        content: `
          <h2>Welcome to Cars.na Newsletter, ${name}!</h2>
          <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
          <ul>
            <li>Latest vehicle listings</li>
            <li>Special deals and promotions</li>
            <li>Market insights and trends</li>
            <li>Tips for buying and selling cars</li>
          </ul>
          <p>Stay tuned for our weekly updates!</p>
        `,
        unsubscribeUrl: `${process.env.NEXTAUTH_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
      });
    } catch (emailError) {
      console.error('Failed to send newsletter subscription email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Successfully subscribed to the newsletter! Check your email for confirmation.',
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Newsletter subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}