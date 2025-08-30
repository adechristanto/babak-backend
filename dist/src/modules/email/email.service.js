"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const handlebars = __importStar(require("handlebars"));
const fs_1 = require("fs");
const path_1 = require("path");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.createTransporter();
    }
    createTransporter() {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpPort = this.configService.get('SMTP_PORT');
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            this.logger.warn('SMTP configuration is incomplete. Email service will not work properly.');
            return;
        }
        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.logger.log(`Email service initialized with SMTP host: ${smtpHost}:${smtpPort}`);
    }
    async sendEmail(options) {
        if (!this.transporter) {
            this.logger.error('Email transporter not configured. Cannot send email.');
            return false;
        }
        try {
            let html = options.html;
            let text = options.text;
            if (options.template && options.context) {
                const templateResult = await this.compileTemplate(options.template, options.context);
                html = templateResult.html;
                text = templateResult.text;
            }
            const mailOptions = {
                from: this.configService.get('DEFAULT_FROM_EMAIL') || this.configService.get('SMTP_USER'),
                to: options.to,
                subject: options.subject,
                html,
                text,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${options.to}. Message ID: ${result.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}:`, error);
            return false;
        }
    }
    async compileTemplate(templateName, context) {
        try {
            const templatePath = (0, path_1.join)(process.cwd(), 'src', 'templates', 'email', `${templateName}.hbs`);
            const templateSource = (0, fs_1.readFileSync)(templatePath, 'utf8');
            const template = handlebars.compile(templateSource);
            const html = template(context);
            const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            return { html, text };
        }
        catch (error) {
            this.logger.error(`Failed to compile email template ${templateName}:`, error);
            throw new Error(`Email template compilation failed: ${templateName}`);
        }
    }
    async sendEmailVerification(email, name, verificationToken) {
        const verificationUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
        return this.sendEmail({
            to: email,
            subject: 'Verify Your Email Address - Babak Marketplace',
            template: 'email-verification',
            context: {
                name: name || 'User',
                verificationUrl,
                supportEmail: this.configService.get('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
            },
        });
    }
    async sendWelcomeEmail(email, name) {
        return this.sendEmail({
            to: email,
            subject: 'Welcome to Babak Marketplace!',
            template: 'welcome',
            context: {
                name: name || 'User',
                loginUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/login`,
                supportEmail: this.configService.get('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
            },
        });
    }
    async sendPasswordResetEmail(email, name, resetToken) {
        const resetUrl = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: email,
            subject: 'Reset Your Password - Babak Marketplace',
            template: 'password-reset',
            context: {
                name: name || 'User',
                resetUrl,
                supportEmail: this.configService.get('DEFAULT_FROM_EMAIL') || 'support@babak.sy',
            },
        });
    }
    async testConnection() {
        if (!this.transporter) {
            return false;
        }
        try {
            await this.transporter.verify();
            this.logger.log('SMTP connection verified successfully');
            return true;
        }
        catch (error) {
            this.logger.error('SMTP connection verification failed:', error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map