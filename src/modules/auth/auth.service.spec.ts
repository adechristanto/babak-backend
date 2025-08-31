import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { User, UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      markEmailAsVerified: jest.fn(),
    };

    const mockEmailService = {
      sendWelcomeEmail: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    emailService = module.get(EmailService);
  });

  describe('verifyEmail', () => {
    const testEmail = 'test@example.com';
    const validToken = `${Buffer.from(testEmail).toString('base64')}.randompart123`;
    const invalidToken = 'invalid.token';

    it('should return "Email is already verified" for already verified users', async () => {
      // Mock user exists and is already verified
      const mockUser: User = {
        id: 1,
        email: testEmail,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        name: 'Test User',
        passwordHash: 'hashedpassword',
        avatarUrl: null,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.verifyEmail(validToken);

      expect(result).toEqual({
        success: false,
        message: 'Email is already verified',
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(testEmail);
    });

    it('should return "Verification token has expired" for expired tokens', async () => {
      const expiredDate = new Date(Date.now() - 1000); // 1 second ago

      // Mock user exists but not verified
      const mockUser: User = {
        id: 1,
        email: testEmail,
        emailVerified: false,
        emailVerificationToken: validToken,
        emailVerificationExpires: expiredDate,
        name: 'Test User',
        passwordHash: 'hashedpassword',
        avatarUrl: null,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      usersService.findByEmail.mockResolvedValue(mockUser);

      // Mock token found in database
      usersService.findByEmailVerificationToken.mockResolvedValue(mockUser);

      const result = await service.verifyEmail(validToken);

      expect(result).toEqual({
        success: false,
        message: 'Verification token has expired',
      });
    });

    it('should successfully verify email for valid token', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Mock user exists but not verified
      const mockUser: User = {
        id: 1,
        email: testEmail,
        emailVerified: false,
        emailVerificationToken: validToken,
        emailVerificationExpires: futureDate,
        name: 'Test User',
        passwordHash: 'hashedpassword',
        avatarUrl: null,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      usersService.findByEmail.mockResolvedValue(mockUser);

      // Mock token found in database
      usersService.findByEmailVerificationToken.mockResolvedValue(mockUser);

      emailService.sendWelcomeEmail.mockResolvedValue(true);

      const result = await service.verifyEmail(validToken);

      expect(result).toEqual({
        success: true,
        message: 'Email verified successfully',
      });
      expect(usersService.markEmailAsVerified).toHaveBeenCalledWith(1);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        testEmail,
        'Test User',
      );
    });

    it('should return error for invalid token format', async () => {
      // Mock that no user is found for the decoded email (since token is invalid)
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.verifyEmail(invalidToken);

      expect(result).toEqual({
        success: false,
        message: 'User not found. The verification link may be invalid.',
      });
    });

    it('should return error for non-existent user', async () => {
      // Mock user not found
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.verifyEmail(validToken);

      expect(result).toEqual({
        success: false,
        message: 'User not found. The verification link may be invalid.',
      });
    });
  });
});
