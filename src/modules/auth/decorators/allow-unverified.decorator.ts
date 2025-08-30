import { SetMetadata } from '@nestjs/common';

export const AllowUnverified = () => SetMetadata('allowUnverified', true);
