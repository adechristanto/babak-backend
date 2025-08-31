import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { PaginatedOffersDto } from './dto/paginated-offers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Offers')
@Controller('offers')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@ApiBearerAuth()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({ status: 201, description: 'Offer created successfully', type: OfferResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 400, description: 'Invalid offer data' })
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: any,
  ): Promise<OfferResponseDto> {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get('received')
  @ApiOperation({ summary: 'Get offers received by current user (as seller)' })
  @ApiResponse({ status: 200, description: 'Offers retrieved successfully', type: PaginatedOffersDto })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getReceivedOffers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Request() req: any,
  ): Promise<PaginatedOffersDto> {
    return this.offersService.getReceivedOffers(req.user.id, page, limit);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get offers sent by current user (as buyer)' })
  @ApiResponse({ status: 200, description: 'Offers retrieved successfully', type: PaginatedOffersDto })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getSentOffers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Request() req: any,
  ): Promise<PaginatedOffersDto> {
    return this.offersService.getSentOffers(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiResponse({ status: 200, description: 'Offer retrieved successfully', type: OfferResponseDto })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<OfferResponseDto> {
    return this.offersService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update offer status (accept/reject/counter)' })
  @ApiResponse({ status: 200, description: 'Offer updated successfully', type: OfferResponseDto })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  @ApiResponse({ status: 403, description: 'You can only update offers for your listings' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
    @Request() req: any,
  ): Promise<OfferResponseDto> {
    return this.offersService.update(id, updateOfferDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete/withdraw offer' })
  @ApiResponse({ status: 200, description: 'Offer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  @ApiResponse({ status: 403, description: 'You can only delete your own offers' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.offersService.remove(id, req.user.id);
    return { message: 'Offer deleted successfully' };
  }
}
