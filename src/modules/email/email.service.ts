import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      this.logger.warn('SMTP configuration is incomplete. Email service will not work properly.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates for development
      },
    });

    this.logger.log(`Email service initialized with SMTP host: ${smtpHost}:${smtpPort}`);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.error('Email transporter not configured. Cannot send email.');
      return false;
    }

    try {
      let html = options.html;
      let text = options.text;

      // If template is specified, compile it with context
      if (options.template && options.context) {
        const templateResult = await this.compileTemplate(options.template, options.context);
        html = templateResult.html;
        text = templateResult.text;
      }

      const mailOptions = {
        from: this.configService.get<string>('DEFAULT_FROM_EMAIL') || this.configService.get<string>('SMTP_USER'),
        to: options.to,
        subject: options.subject,
        html,
        text,
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email sent successfully to ${options.to}. Message ID: ${result.messageId as string}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  private async compileTemplate(templateName: string, context: Record<string, any>): Promise<{ html: string; text: string }> {
    try {
      const templatePath = join(process.cwd(), 'src', 'templates', 'email', `${templateName}.hbs`);
      const templateSource = readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      const html = template(context);
      
      // Create a simple text version by stripping HTML tags
      const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      
      return { html, text };
    } catch (error) {
      this.logger.error(`Failed to compile email template ${templateName}:`, error);
      throw new Error(`Email template compilation failed: ${templateName}`);
    }
  }

  // Specific email methods
  async sendEmailVerification(email: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - Babak Marketplace',
      template: 'email-verification',
      context: {
        name: name || 'User',
        verificationUrl,
        supportEmail: this.configService.get<string>('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Babak Marketplace!',
      template: 'welcome',
      context: {
        name: name || 'User',
        loginUrl: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/login`,
        supportEmail: this.configService.get<string>('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
      },
    });
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - Babak Marketplace',
      template: 'password-reset',
      context: {
        name: name || 'User',
        resetUrl,
        supportEmail: this.configService.get<string>('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
      },
    });
  }

  // Test email connectivity
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}
