import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { ListingImagesService } from './images/listing-images.service';
import { ListingImagesController } from './images/listing-images.controller';
import { ListingUpgradesService } from './listing-upgrades.service';
import { ListingUpgradesController } from './listing-upgrades.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [ListingsController, ListingImagesController, ListingUpgradesController],
  providers: [ListingsService, ListingImagesService, ListingUpgradesService],
  exports: [ListingsService, ListingImagesService, ListingUpgradesService],
})
export class ListingsModule {}
