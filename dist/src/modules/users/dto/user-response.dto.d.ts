import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: number;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    phone: string | null;
    location: string | null;
    locationAddress: string | null;
    locationCity: string | null;
    locationCountry: string | null;
    locationLatitude: number | null;
    locationLongitude: number | null;
    locationPlaceId: string | null;
    bio: string | null;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    emailVerificationToken: string | null;
    emailVerificationExpires: Date | null;
    constructor(partial: any);
}
