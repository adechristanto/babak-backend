import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryAttributesService } from './category-attributes.service';
import { CategoryAttributesController } from './category-attributes.controller';

@Module({
  controllers: [CategoriesController, CategoryAttributesController],
  providers: [CategoriesService, CategoryAttributesService],
  exports: [CategoriesService, CategoryAttributesService],
})
export class CategoriesModule {}
