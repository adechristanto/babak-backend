import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as allowing unverified users
    const allowUnverified = this.reflector.getAllAndOverride<boolean>('allowUnverified', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowUnverified) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Get the full user data to check email verification status
    const fullUser = await this.usersService.findByEmail(user.email);
    
    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    if (!fullUser.emailVerified) {
      throw new UnauthorizedException('Email verification required');
    }

    return true;
  }
}
