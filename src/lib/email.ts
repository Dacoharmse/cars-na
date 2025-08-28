/**
 * Email service for Cars.na platform
 * Handles registration, login notifications, and general communications
 */

import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Email configuration types
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface UserData {
  name: string;
  email: string;
  id?: string;
  dealershipName?: string;
  verificationToken?: string;
}

interface VehicleData {
  make: string;
  model: string;
  year: number;
  price: number;
  dealerName: string;
}

class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // Configuration for multiple email providers
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASSWORD || '',
        },
      };

      this.transporter = nodemailer.createTransporter(config);

      // Verify connection
      await this.transporter.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Email service initialization failed:', error);
      
      // Fallback to console logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using console fallback for email in development mode');
      }
    }
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      if (!this.transporter) {
        // Fallback for development - log to console
        if (process.env.NODE_ENV === 'development') {
          console.log('📧 EMAIL FALLBACK - Would send email to:', to);
          console.log('📧 Subject:', template.subject);
          console.log('📧 Content:', template.text);
          return true;
        }
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: `"Cars.na" <${process.env.SMTP_USER}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Welcome email for new user registration
  async sendWelcomeEmail(userData: UserData): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Welcome to Cars.na - Your Automotive Journey Begins!',
      html: this.generateWelcomeEmailHTML(userData),
      text: this.generateWelcomeEmailText(userData),
    };

    return await this.sendEmail(userData.email, template);
  }

  // Email verification for new registrations
  async sendVerificationEmail(userData: UserData): Promise<boolean> {
    if (!userData.verificationToken) {
      throw new Error('Verification token is required');
    }

    const template: EmailTemplate = {
      subject: 'Verify Your Cars.na Account',
      html: this.generateVerificationEmailHTML(userData),
      text: this.generateVerificationEmailText(userData),
    };

    return await this.sendEmail(userData.email, template);
  }

  // Login notification email
  async sendLoginNotification(userData: UserData, loginDetails: { ip?: string; location?: string; device?: string }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'New Login to Your Cars.na Account',
      html: this.generateLoginNotificationHTML(userData, loginDetails),
      text: this.generateLoginNotificationText(userData, loginDetails),
    };

    return await this.sendEmail(userData.email, template);
  }

  // Password reset email
  async sendPasswordResetEmail(userData: UserData, resetToken: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Reset Your Cars.na Password',
      html: this.generatePasswordResetHTML(userData, resetToken),
      text: this.generatePasswordResetText(userData, resetToken),
    };

    return await this.sendEmail(userData.email, template);
  }

  // Dealer registration approval
  async sendDealerApprovalEmail(userData: UserData): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Your Cars.na Dealer Application Has Been Approved!',
      html: this.generateDealerApprovalHTML(userData),
      text: this.generateDealerApprovalText(userData),
    };

    return await this.sendEmail(userData.email, template);
  }

  // Vehicle listing notifications
  async sendVehicleInquiryNotification(dealerEmail: string, inquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicle: VehicleData;
    message: string;
  }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: `New Vehicle Inquiry - ${inquiryData.vehicle.year} ${inquiryData.vehicle.make} ${inquiryData.vehicle.model}`,
      html: this.generateVehicleInquiryHTML(inquiryData),
      text: this.generateVehicleInquiryText(inquiryData),
    };

    return await this.sendEmail(dealerEmail, template);
  }

  // Newsletter and promotional emails
  async sendNewsletterEmail(userData: UserData, content: {
    subject: string;
    headline: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: content.subject,
      html: this.generateNewsletterHTML(userData, content),
      text: this.generateNewsletterText(userData, content),
    };

    return await this.sendEmail(userData.email, template);
  }

  // HTML Email Templates
  private generateWelcomeEmailHTML(userData: UserData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Cars.na</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: #ffffff; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .welcome-title { color: #1F3469; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { color: #374151; line-height: 1.6; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
            .social-links { margin: 20px 0; }
            .social-links a { color: #1F3469; text-decoration: none; margin: 0 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
              <div class="header-text">Namibia's Leading Automotive Platform</div>
            </div>
            
            <div class="content">
              <h1 class="welcome-title">Welcome to Cars.na, ${userData.name}!</h1>
              
              <p class="message">
                We're thrilled to have you join our community of automotive enthusiasts! You now have access to Namibia's most comprehensive vehicle marketplace, where you can buy, sell, and discover your perfect car.
              </p>
              
              <p class="message">
                <strong>What you can do with your Cars.na account:</strong><br>
                • Browse thousands of vehicles from trusted dealers<br>
                • Save your favorite vehicles and get alerts<br>
                • Contact dealers directly for inquiries<br>
                • List your own vehicles for sale<br>
                • Access exclusive deals and early listings
              </p>
              
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/vehicles" class="cta-button">
                Start Browsing Vehicles
              </a>
              
              <p class="message">
                Need help getting started? Our <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/help" style="color: #1F3469;">Help Center</a> has everything you need to know.
              </p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
              </div>
              <p>Cars.na - Connecting Namibia's Automotive Community</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateWelcomeEmailText(userData: UserData): string {
    return `
Welcome to Cars.na, ${userData.name}!

We're thrilled to have you join our community of automotive enthusiasts! You now have access to Namibia's most comprehensive vehicle marketplace.

What you can do with your Cars.na account:
• Browse thousands of vehicles from trusted dealers
• Save your favorite vehicles and get alerts
• Contact dealers directly for inquiries
• List your own vehicles for sale
• Access exclusive deals and early listings

Start browsing vehicles: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/vehicles

Need help? Visit our Help Center: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/help

Best regards,
The Cars.na Team
    `;
  }

  private generateVerificationEmailHTML(userData: UserData): string {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${userData.verificationToken}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Cars.na Account</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; text-align: center; }
            .verify-title { color: #1F3469; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { color: #374151; line-height: 1.6; margin-bottom: 30px; }
            .verify-button { display: inline-block; background: linear-gradient(135deg, #109B4A 0%, #2EBA6A 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .token-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="verify-title">Verify Your Email Address</h1>
              
              <p class="message">
                Hi ${userData.name},<br><br>
                Please verify your email address to complete your Cars.na account setup and start exploring Namibia's best vehicle marketplace.
              </p>
              
              <a href="${verificationUrl}" class="verify-button">
                Verify My Account
              </a>
              
              <p class="message">
                Or copy and paste this link in your browser:<br>
                <div class="token-info">${verificationUrl}</div>
              </p>
              
              <p class="message">
                This verification link will expire in 24 hours for your security.
              </p>
            </div>
            
            <div class="footer">
              <p>If you didn't create a Cars.na account, please ignore this email.</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateVerificationEmailText(userData: UserData): string {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${userData.verificationToken}`;
    
    return `
Verify Your Cars.na Account

Hi ${userData.name},

Please verify your email address to complete your Cars.na account setup.

Verification link: ${verificationUrl}

This link will expire in 24 hours for your security.

If you didn't create a Cars.na account, please ignore this email.

Best regards,
The Cars.na Team
    `;
  }

  private generateLoginNotificationHTML(userData: UserData, loginDetails: { ip?: string; location?: string; device?: string }): string {
    const now = new Date().toLocaleString('en-US', { 
      timeZone: 'Africa/Windhoek',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Notification - Cars.na</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 30px 20px; text-align: center; }
            .logo { color: white; font-size: 24px; font-weight: bold; }
            .content { padding: 30px; }
            .alert-title { color: #1F3469; font-size: 20px; font-weight: bold; margin-bottom: 20px; }
            .login-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: 600; color: #374151; }
            .info-value { color: #6b7280; }
            .security-note { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; color: #92400e; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="alert-title">New Login Detected</h1>
              
              <p>Hi ${userData.name},</p>
              
              <p>We detected a new login to your Cars.na account. Here are the details:</p>
              
              <div class="login-info">
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${now}</span>
                </div>
                ${loginDetails.ip ? `
                <div class="info-row">
                  <span class="info-label">IP Address:</span>
                  <span class="info-value">${loginDetails.ip}</span>
                </div>
                ` : ''}
                ${loginDetails.location ? `
                <div class="info-row">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${loginDetails.location}</span>
                </div>
                ` : ''}
                ${loginDetails.device ? `
                <div class="info-row">
                  <span class="info-label">Device:</span>
                  <span class="info-value">${loginDetails.device}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="security-note">
                <strong>Was this you?</strong><br>
                If you didn't log in to your account, please contact our support team immediately and consider changing your password.
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated security notification from Cars.na</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateLoginNotificationText(userData: UserData, loginDetails: { ip?: string; location?: string; device?: string }): string {
    const now = new Date().toLocaleString('en-US', { 
      timeZone: 'Africa/Windhoek',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    return `
New Login to Your Cars.na Account

Hi ${userData.name},

We detected a new login to your Cars.na account:

Time: ${now}
${loginDetails.ip ? `IP Address: ${loginDetails.ip}` : ''}
${loginDetails.location ? `Location: ${loginDetails.location}` : ''}
${loginDetails.device ? `Device: ${loginDetails.device}` : ''}

If this wasn't you, please contact our support team immediately.

Best regards,
The Cars.na Security Team
    `;
  }

  private generatePasswordResetHTML(userData: UserData, resetToken: string): string {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Cars.na Password</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #CB2030 0%, #E04B56 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; text-align: center; }
            .reset-title { color: #CB2030; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { color: #374151; line-height: 1.6; margin-bottom: 30px; }
            .reset-button { display: inline-block; background: linear-gradient(135deg, #CB2030 0%, #E04B56 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .security-info { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="reset-title">Reset Your Password</h1>
              
              <p class="message">
                Hi ${userData.name},<br><br>
                You recently requested to reset your password for your Cars.na account. Click the button below to reset it.
              </p>
              
              <a href="${resetUrl}" class="reset-button">
                Reset My Password
              </a>
              
              <div class="security-info">
                <strong>Security Information:</strong><br>
                • This link expires in 1 hour for your security<br>
                • If you didn't request this reset, please ignore this email<br>
                • Your password won't change until you create a new one
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message from Cars.na</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generatePasswordResetText(userData: UserData, resetToken: string): string {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    return `
Reset Your Cars.na Password

Hi ${userData.name},

You requested to reset your password for your Cars.na account.

Reset link: ${resetUrl}

This link expires in 1 hour for security reasons.

If you didn't request this reset, please ignore this email.

Best regards,
The Cars.na Team
    `;
  }

  private generateDealerApprovalHTML(userData: UserData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dealer Application Approved - Cars.na</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #109B4A 0%, #2EBA6A 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .approval-title { color: #109B4A; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .message { color: #374151; line-height: 1.6; margin-bottom: 20px; }
            .benefits-list { background: #f0f9f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #109B4A 0%, #2EBA6A 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="approval-title">🎉 Congratulations! Your Dealer Application is Approved!</h1>
              
              <p class="message">
                Hi ${userData.name},<br><br>
                We're excited to welcome ${userData.dealershipName || 'your dealership'} to the Cars.na family! Your dealer account has been approved and is now active.
              </p>
              
              <div class="benefits-list">
                <h3 style="color: #109B4A; margin-top: 0;">What you can do now:</h3>
                <ul>
                  <li>List unlimited vehicles on our platform</li>
                  <li>Manage your inventory through our dealer dashboard</li>
                  <li>Receive inquiries directly from potential buyers</li>
                  <li>Access advanced analytics and reporting</li>
                  <li>Promote your listings with featured placements</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dealer/dashboard" class="cta-button">
                  Access Dealer Dashboard
                </a>
              </div>
              
              <p class="message">
                Need help getting started? Our dealer support team is here to assist you. Visit our <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/help" style="color: #109B4A;">Help Center</a> or contact us directly.
              </p>
            </div>
            
            <div class="footer">
              <p>Welcome to Cars.na - Let's grow your business together!</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateDealerApprovalText(userData: UserData): string {
    return `
Congratulations! Your Dealer Application is Approved!

Hi ${userData.name},

We're excited to welcome ${userData.dealershipName || 'your dealership'} to the Cars.na family! Your dealer account is now active.

What you can do now:
• List unlimited vehicles on our platform
• Manage your inventory through our dealer dashboard
• Receive inquiries directly from potential buyers
• Access advanced analytics and reporting
• Promote your listings with featured placements

Access your dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dealer/dashboard

Need help? Visit our Help Center: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/help

Welcome to Cars.na!
The Cars.na Team
    `;
  }

  private generateVehicleInquiryHTML(inquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicle: VehicleData;
    message: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Vehicle Inquiry - Cars.na</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 30px 20px; text-align: center; }
            .logo { color: white; font-size: 24px; font-weight: bold; }
            .content { padding: 30px; }
            .inquiry-title { color: #1F3469; font-size: 20px; font-weight: bold; margin-bottom: 20px; }
            .vehicle-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .customer-info { background: #f0f9f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .message-box { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .info-row { margin: 10px 0; }
            .label { font-weight: 600; color: #374151; }
            .value { color: #6b7280; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="inquiry-title">🚗 New Vehicle Inquiry</h1>
              
              <div class="vehicle-info">
                <h3 style="margin-top: 0; color: #1F3469;">Vehicle Details:</h3>
                <div class="info-row">
                  <span class="label">Vehicle:</span> ${inquiryData.vehicle.year} ${inquiryData.vehicle.make} ${inquiryData.vehicle.model}
                </div>
                <div class="info-row">
                  <span class="label">Price:</span> N$ ${inquiryData.vehicle.price.toLocaleString()}
                </div>
              </div>
              
              <div class="customer-info">
                <h3 style="margin-top: 0; color: #109B4A;">Customer Information:</h3>
                <div class="info-row">
                  <span class="label">Name:</span> ${inquiryData.customerName}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> <a href="mailto:${inquiryData.customerEmail}">${inquiryData.customerEmail}</a>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span> <a href="tel:${inquiryData.customerPhone}">${inquiryData.customerPhone}</a>
                </div>
              </div>
              
              <div class="message-box">
                <h4 style="margin-top: 0; color: #92400e;">Customer Message:</h4>
                <p style="margin-bottom: 0; color: #92400e;">${inquiryData.message}</p>
              </div>
              
              <p>Please respond to this inquiry promptly to maintain good customer service standards.</p>
            </div>
            
            <div class="footer">
              <p>This inquiry was generated through Cars.na</p>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateVehicleInquiryText(inquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicle: VehicleData;
    message: string;
  }): string {
    return `
New Vehicle Inquiry - Cars.na

Vehicle: ${inquiryData.vehicle.year} ${inquiryData.vehicle.make} ${inquiryData.vehicle.model}
Price: N$ ${inquiryData.vehicle.price.toLocaleString()}

Customer Information:
Name: ${inquiryData.customerName}
Email: ${inquiryData.customerEmail}
Phone: ${inquiryData.customerPhone}

Message:
${inquiryData.message}

Please respond promptly to maintain good customer service.

Best regards,
Cars.na Team
    `;
  }

  private generateNewsletterHTML(userData: UserData, content: {
    headline: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cars.na Newsletter</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .headline { color: #1F3469; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .message { color: #374151; line-height: 1.6; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1F3469 0%, #3B4F86 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .unsubscribe { margin-top: 20px; }
            .unsubscribe a { color: #6b7280; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Cars.na</div>
            </div>
            
            <div class="content">
              <h1 class="headline">${content.headline}</h1>
              
              <p class="message">Hi ${userData.name},</p>
              
              <div class="message">${content.message}</div>
              
              ${content.ctaText && content.ctaUrl ? `
                <div style="text-align: center;">
                  <a href="${content.ctaUrl}" class="cta-button">
                    ${content.ctaText}
                  </a>
                </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>Thank you for being part of the Cars.na community!</p>
              <div class="unsubscribe">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(userData.email)}">Unsubscribe from newsletters</a>
              </div>
              <p>© 2024 Cars.na. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateNewsletterText(userData: UserData, content: {
    headline: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  }): string {
    return `
${content.headline}

Hi ${userData.name},

${content.message}

${content.ctaText && content.ctaUrl ? `${content.ctaText}: ${content.ctaUrl}` : ''}

Thank you for being part of the Cars.na community!

Unsubscribe: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(userData.email)}

Best regards,
The Cars.na Team
    `;
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types for use in other files
export type { UserData, VehicleData };