import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration from environment variables
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

let transporter: Transporter | null = null;

// Initialize email transporter
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
}

// Email template types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email not configured. Skipping email send.');
      console.log('Would have sent email to:', options.to);
      console.log('Subject:', options.subject);
      return false;
    }

    const transport = getTransporter();

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'CareerCompass <noreply@careercompass.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Email templates
export function getEnrollmentConfirmationEmail(data: {
  userName: string;
  courseTitle: string;
  courseUrl: string;
  isPaid: boolean;
  amount?: number;
}): EmailOptions {
  const { userName, courseTitle, courseUrl, isPaid, amount } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .price { font-size: 24px; font-weight: bold; color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Enrollment Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Great news! You've been successfully enrolled in:</p>
          <h3 style="color: #667eea;">${courseTitle}</h3>

          ${isPaid && amount ? `
            <p>Payment Details:</p>
            <p class="price">$${(amount / 100).toFixed(2)}</p>
            <p style="color: #666; font-size: 14px;">Thank you for your purchase!</p>
          ` : `
            <p style="color: #28a745; font-weight: bold;">This is a free course!</p>
          `}

          <p>You can now start learning and access all course materials.</p>

          <a href="${courseUrl}" class="button">Start Learning Now</a>

          <p>Happy learning! 🚀</p>
          <p>Best regards,<br>The CareerCompass Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} CareerCompass. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: '',
    subject: `Welcome to ${courseTitle}!`,
    html,
  };
}

export function getPasswordResetEmail(data: {
  userName: string;
  resetUrl: string;
  expiresIn: string;
}): EmailOptions {
  const { userName, resetUrl, expiresIn } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We received a request to reset your password for your CareerCompass account.</p>

          <p>Click the button below to reset your password:</p>

          <a href="${resetUrl}" class="button">Reset Password</a>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in ${expiresIn}</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>

          <p>Best regards,<br>The CareerCompass Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} CareerCompass. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: '',
    subject: 'Password Reset Request - CareerCompass',
    html,
  };
}

export function getCourseCompletionEmail(data: {
  userName: string;
  courseTitle: string;
  completionDate: string;
  certificateUrl?: string;
}): EmailOptions {
  const { userName, courseTitle, completionDate, certificateUrl } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .badge { display: inline-block; background: #ffc107; color: #333; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Congratulations!</h1>
        </div>
        <div class="content">
          <h2>Amazing work, ${userName}!</h2>
          <p>You've successfully completed:</p>
          <h3 style="color: #28a745;">${courseTitle}</h3>

          <div class="badge">✨ Course Completed ✨</div>

          <p><strong>Completion Date:</strong> ${completionDate}</p>

          ${certificateUrl ? `
            <p>Your certificate of completion is ready!</p>
            <a href="${certificateUrl}" class="button">Download Certificate</a>
          ` : `
            <p>Your certificate will be available soon in your dashboard.</p>
          `}

          <p>We're proud of your dedication and achievement. Keep learning and growing!</p>

          <p>Best regards,<br>The CareerCompass Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} CareerCompass. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    to: '',
    subject: `Congratulations! You've completed ${courseTitle}`,
    html,
  };
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email service not configured');
      return false;
    }

    const transport = getTransporter();
    await transport.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
