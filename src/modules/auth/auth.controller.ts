import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { AllowUnverified } from './decorators/allow-unverified.decorator';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any,
  ): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiBearerAuth()
  async refresh(@Request() req: any): Promise<AuthResponseDto> {
    const user = await this.authService.findUserByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.authService.refreshToken(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiBearerAuth()
  async logout(): Promise<{ message: string }> {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: 'Logged out successfully' };
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiQuery({ name: 'token', description: 'Email verification token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Query('token') token: string): Promise<{ success: boolean; message: string }> {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @UseGuards(ThrottlerGuard)
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully' })
  @ApiResponse({ status: 400, description: 'Email already verified or user not found' })
  async resendVerification(@Body('email') email: string): Promise<{ success: boolean; message: string }> {
    return this.authService.resendVerificationEmail(email);
  }

  @Get('verification-status')
  @UseGuards(JwtAuthGuard)
  @AllowUnverified()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user email verification status' })
  @ApiResponse({ status: 200, description: 'Verification status retrieved successfully' })
  @ApiBearerAuth()
  async getVerificationStatus(@Request() req: any): Promise<{ emailVerified: boolean; email: string }> {
    const user = await this.authService.findUserByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { emailVerified: user.emailVerified, email: user.email };
  }
}
