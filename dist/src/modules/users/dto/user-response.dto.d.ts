import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: number;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    emailVerificationToken: string | null;
    emailVerificationExpires: Date | null;
    constructor(partial: Partial<UserResponseDto>);
}
