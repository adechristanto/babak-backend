import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CategoryAttributesService } from './category-attributes.service';
import {
  CreateCategoryAttributeDto,
  UpdateCategoryAttributeDto,
  CategoryAttributeResponseDto,
} from './dto/category-attribute.dto';

@ApiTags('Category Attributes')
@Controller('categories')
export class CategoryAttributesController {
  constructor(private readonly categoryAttributesService: CategoryAttributesService) {}

  @Post(':categoryId/attributes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Create a new category attribute' })
  @ApiResponse({ status: 201, description: 'Category attribute created successfully', type: CategoryAttributeResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Attribute key already exists' })
  @ApiBearerAuth()
  async create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createDto: CreateCategoryAttributeDto,
  ): Promise<CategoryAttributeResponseDto> {
    // Override categoryId from URL parameter
    createDto.categoryId = categoryId;
    return this.categoryAttributesService.create(createDto);
  }

  @Post(':categoryId/attributes/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Create multiple category attributes' })
  @ApiResponse({ status: 201, description: 'Category attributes created successfully', type: [CategoryAttributeResponseDto] })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Some attribute keys already exist' })
  @ApiBearerAuth()
  async bulkCreate(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createDtos: CreateCategoryAttributeDto[],
  ): Promise<CategoryAttributeResponseDto[]> {
    return this.categoryAttributesService.bulkCreate(categoryId, createDtos);
  }

  @Get('attributes')
  @ApiOperation({ summary: 'Get all category attributes' })
  @ApiResponse({ status: 200, description: 'Category attributes retrieved successfully', type: [CategoryAttributeResponseDto] })
  async findAll(): Promise<CategoryAttributeResponseDto[]> {
    return this.categoryAttributesService.findAll();
  }

  @Get(':categoryId/attributes')
  @ApiOperation({ summary: 'Get attributes for a specific category' })
  @ApiResponse({ status: 200, description: 'Category attributes retrieved successfully', type: [CategoryAttributeResponseDto] })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryAttributeResponseDto[]> {
    return this.categoryAttributesService.findByCategory(categoryId);
  }

  @Get(':categoryId/attributes/inherited')
  @ApiOperation({ summary: 'Get attributes for a category including inherited from parents' })
  @ApiResponse({ status: 200, description: 'Category attributes retrieved successfully', type: [CategoryAttributeResponseDto] })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategoryAndParents(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryAttributeResponseDto[]> {
    return this.categoryAttributesService.findByCategoryAndParents(categoryId);
  }

  @Get('attributes/:id')
  @ApiOperation({ summary: 'Get a specific category attribute' })
  @ApiResponse({ status: 200, description: 'Category attribute retrieved successfully', type: CategoryAttributeResponseDto })
  @ApiResponse({ status: 404, description: 'Category attribute not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryAttributeResponseDto> {
    return this.categoryAttributesService.findOne(id);
  }

  @Patch('attributes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Update a category attribute' })
  @ApiResponse({ status: 200, description: 'Category attribute updated successfully', type: CategoryAttributeResponseDto })
  @ApiResponse({ status: 404, description: 'Category attribute not found' })
  @ApiResponse({ status: 409, description: 'Attribute key already exists' })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryAttributeDto,
  ): Promise<CategoryAttributeResponseDto> {
    return this.categoryAttributesService.update(id, updateDto);
  }

  @Delete('attributes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category attribute' })
  @ApiResponse({ status: 204, description: 'Category attribute deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category attribute not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete attribute in use' })
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryAttributesService.remove(id);
  }

  @Post(':categoryId/attributes/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reorder category attributes' })
  @ApiResponse({ status: 204, description: 'Attributes reordered successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid attribute IDs' })
  @ApiBearerAuth()
  async reorderAttributes(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() attributeOrders: { id: number; displayOrder: number }[],
  ): Promise<void> {
    return this.categoryAttributesService.reorderAttributes(categoryId, attributeOrders);
  }
}
