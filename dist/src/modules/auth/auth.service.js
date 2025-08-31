"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    emailService;
    constructor(usersService, jwtService, configService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await this.usersService.validatePassword(user, password))) {
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const userResponse = new user_response_dto_1.UserResponseDto(user);
        return new auth_response_dto_1.AuthResponseDto(accessToken, userResponse);
    }
    async register(registerDto) {
        const randomPart = (0, crypto_1.randomBytes)(32).toString('hex');
        const emailPart = Buffer.from(registerDto.email).toString('base64');
        const emailVerificationToken = `${emailPart}.${randomPart}`;
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const userResponse = await this.usersService.create({
            ...registerDto,
            emailVerificationToken,
            emailVerificationExpires,
        });
        const user = await this.usersService.findByEmail(registerDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Registration failed');
        }
        try {
            await this.emailService.sendEmailVerification(user.email, user.name || 'User', emailVerificationToken);
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return new auth_response_dto_1.AuthResponseDto(accessToken, userResponse);
    }
    async refreshToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const userResponse = new user_response_dto_1.UserResponseDto(user);
        return new auth_response_dto_1.AuthResponseDto(accessToken, userResponse);
    }
    async findUserByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    async verifyEmail(token) {
        let email = null;
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 2) {
                const emailPart = tokenParts[0];
                email = Buffer.from(emailPart, 'base64').toString();
            }
        }
        catch {
            return {
                success: false,
                message: 'Invalid verification token format.',
            };
        }
        if (!email) {
            return {
                success: false,
                message: 'Invalid verification token format.',
            };
        }
        const existingUser = await this.usersService.findByEmail(email);
        if (!existingUser) {
            return {
                success: false,
                message: 'User not found. The verification link may be invalid.',
            };
        }
        if (existingUser.emailVerified) {
            return {
                success: false,
                message: 'Email is already verified',
            };
        }
        const user = await this.usersService.findByEmailVerificationToken(token);
        if (!user) {
            return {
                success: false,
                message: 'Verification link is no longer valid. This could be because the link has expired or has already been used.',
            };
        }
        if (user.emailVerificationExpires &&
            user.emailVerificationExpires < new Date()) {
            return { success: false, message: 'Verification token has expired' };
        }
        if (user.emailVerified) {
            return { success: false, message: 'Email is already verified' };
        }
        await this.usersService.markEmailAsVerified(user.id);
        try {
            await this.emailService.sendWelcomeEmail(user.email, user.name || 'User');
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
        }
        return { success: true, message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.emailVerified) {
            return { success: false, message: 'Email is already verified' };
        }
        const randomPart = (0, crypto_1.randomBytes)(32).toString('hex');
        const emailPart = Buffer.from(email).toString('base64');
        const emailVerificationToken = `${emailPart}.${randomPart}`;
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.usersService.updateEmailVerificationToken(user.id, emailVerificationToken, emailVerificationExpires);
        try {
            await this.emailService.sendEmailVerification(user.email, user.name || 'User', emailVerificationToken);
            return { success: true, message: 'Verification email sent successfully' };
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
            return { success: false, message: 'Failed to send verification email' };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map