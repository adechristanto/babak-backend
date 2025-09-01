import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { ListingImagesService } from './images/listing-images.service';
import { ListingImagesController } from './images/listing-images.controller';
import { ListingUpgradesService } from './listing-upgrades.service';
import { ListingUpgradesController } from './listing-upgrades.controller';
import { ListingAttributesService } from './listing-attributes.service';
import { UploadsModule } from '../uploads/uploads.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UploadsModule, AuthModule, UsersModule, EmailModule],
  controllers: [ListingsController, ListingImagesController, ListingUpgradesController],
  providers: [ListingsService, ListingImagesService, ListingUpgradesService, ListingAttributesService],
  exports: [ListingsService, ListingImagesService, ListingUpgradesService, ListingAttributesService],
})
export class ListingsModule {}
