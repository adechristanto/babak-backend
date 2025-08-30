import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: number;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    constructor(partial: Partial<UserResponseDto>);
}
