import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class UpgradeListingDto {
  @ApiProperty({ example: true, required: false, description: 'Make listing VIP' })
  @IsBoolean()
  @IsOptional()
  isVip?: boolean;

  @ApiProperty({ example: true, required: false, description: 'Make listing featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ example: 30, required: false, minimum: 1, maximum: 365, description: 'Days to extend expiration' })
  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  extendDays?: number;
}
