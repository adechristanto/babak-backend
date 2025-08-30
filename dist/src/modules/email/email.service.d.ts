import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    template?: string;
    context?: Record<string, any>;
    html?: string;
    text?: string;
}
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private createTransporter;
    sendEmail(options: EmailOptions): Promise<boolean>;
    private compileTemplate;
    sendEmailVerification(email: string, name: string, verificationToken: string): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean>;
    testConnection(): Promise<boolean>;
}
