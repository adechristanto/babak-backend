import { ApiProperty } from '@nestjs/swagger';
import { OfferResponseDto } from './offer-response.dto';
import { PaginationMetaDto } from '../../listings/dto/paginated-listings.dto';

export class PaginatedOffersDto {
  @ApiProperty({ 
    description: 'Array of offers',
    type: [OfferResponseDto]
  })
  data: OfferResponseDto[];

  @ApiProperty({ 
    description: 'Pagination metadata',
    type: PaginationMetaDto
  })
  meta: PaginationMetaDto;

  constructor(data: OfferResponseDto[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
