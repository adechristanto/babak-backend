import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.usersService.validatePassword(user, password)) {
      return user;
    }
    
    return null;
  }

  async login(user: User): Promise<AuthResponseDto> {
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
    // Create user using the users service
    const userResponse = await this.usersService.create(registerDto);
    
    // Get the full user object for token generation
    const user = await this.usersService.findByEmail(registerDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Registration failed');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto(accessToken, userResponse);
  }

  async refreshToken(user: User): Promise<AuthResponseDto> {
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
}
