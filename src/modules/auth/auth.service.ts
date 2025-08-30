import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await this.usersService.validatePassword(user, password))) {
      return user;
    }

    return null;
  }

  login(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(user);

    return new AuthResponseDto(accessToken, userResponse);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Generate email verification token with email embedded
    const randomPart = randomBytes(32).toString('hex');
    const emailPart = Buffer.from(registerDto.email).toString('base64');
    const emailVerificationToken = `${emailPart}.${randomPart}`;
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with email verification fields
    const userResponse = await this.usersService.create({
      ...registerDto,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // Get the full user object for token generation
    const user = await this.usersService.findByEmail(registerDto.email);

    if (!user) {
      throw new UnauthorizedException('Registration failed');
    }

    // Send verification email
    try {
      await this.emailService.sendEmailVerification(
        user.email,
        user.name || 'User',
        emailVerificationToken,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails, but log it
    }

    // Generate JWT token (user can still get token but needs to verify email for full access)
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto(accessToken, userResponse);
  }

  refreshToken(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(user);

    return new AuthResponseDto(accessToken, userResponse);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.usersService.findByEmailVerificationToken(token);

    if (!user) {
      // Token not found - this could mean:
      // 1. Token is invalid/expired
      // 2. User has already verified their email (token was cleared)

      // Try to extract email from the token to check if user is already verified
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 2) {
          const emailPart = tokenParts[0];
          const email = Buffer.from(emailPart, 'base64').toString();

          // Check if there's a user with this email that's already verified
          const existingUser = await this.usersService.findByEmail(email);
          if (existingUser && existingUser.emailVerified) {
            return { success: false, message: 'Email is already verified' };
          }
        }
      } catch {
        // If we can't decode the token, continue with the default error message
      }

      // Return a more specific error message that the frontend can handle
      return {
        success: false,
        message:
          'Invalid or expired verification token. If you have already verified your email, you can proceed to use the application.',
      };
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      return { success: false, message: 'Verification token has expired' };
    }

    if (user.emailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Update user to mark email as verified
    await this.usersService.markEmailAsVerified(user.id);

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name || 'User');
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail verification if welcome email fails
    }

    return { success: true, message: 'Email verified successfully' };
  }

  async resendVerificationEmail(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.emailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Generate new verification token with email embedded
    const randomPart = randomBytes(32).toString('hex');
    const emailPart = Buffer.from(email).toString('base64');
    const emailVerificationToken = `${emailPart}.${randomPart}`;
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await this.usersService.updateEmailVerificationToken(
      user.id,
      emailVerificationToken,
      emailVerificationExpires,
    );

    // Send verification email
    try {
      await this.emailService.sendEmailVerification(
        user.email,
        user.name || 'User',
        emailVerificationToken,
      );
      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, message: 'Failed to send verification email' };
    }
  }
}
