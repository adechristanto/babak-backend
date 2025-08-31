import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  name: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @Expose()
  avatarUrl: string | null;

  @ApiProperty({ example: '+1234567890' })
  @Expose()
  phone: string | null;

  @ApiProperty({ example: 'Damascus, Syria' })
  @Expose()
  location: string | null;

  @ApiProperty({ example: 'Damascus, Syria' })
  @Expose()
  locationAddress: string | null;

  @ApiProperty({ example: 'Damascus' })
  @Expose()
  locationCity: string | null;

  @ApiProperty({ example: 'Syria' })
  @Expose()
  locationCountry: string | null;

  @ApiProperty({ example: 33.5138 })
  @Expose()
  locationLatitude: number | null;

  @ApiProperty({ example: 36.2765 })
  @Expose()
  locationLongitude: number | null;

  @ApiProperty({ example: 'ChIJi8mnMiKyGhURuiw1EyBCa2o' })
  @Expose()
  locationPlaceId: string | null;

  @ApiProperty({ example: 'Bio description' })
  @Expose()
  bio: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: true })
  @Expose()
  emailVerified: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  @Exclude()
  emailVerificationToken: string | null;

  @Exclude()
  emailVerificationExpires: Date | null;

  constructor(partial: any) {
    Object.assign(this, partial);

    // Convert Decimal types to numbers for location coordinates
    if (partial.locationLatitude !== null && partial.locationLatitude !== undefined) {
      this.locationLatitude = typeof partial.locationLatitude === 'object'
        ? Number(partial.locationLatitude.toString())
        : partial.locationLatitude;
    }

    if (partial.locationLongitude !== null && partial.locationLongitude !== undefined) {
      this.locationLongitude = typeof partial.locationLongitude === 'object'
        ? Number(partial.locationLongitude.toString())
        : partial.locationLongitude;
    }
  }
}
