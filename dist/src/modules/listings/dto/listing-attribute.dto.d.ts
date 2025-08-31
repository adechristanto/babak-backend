import { AttributeType, AttributeDataType } from '@prisma/client';
export declare class CreateListingAttributeDto {
  attributeId: number;
  value?: string;
  numericValue?: number;
  booleanValue?: boolean;
  dateValue?: string;
  jsonValue?: any;
}
export declare class UpdateListingAttributeDto {
  value?: string;
  numericValue?: number;
  booleanValue?: boolean;
  dateValue?: string;
  jsonValue?: any;
}
export declare class ListingAttributeResponseDto {
  id: number;
  listingId: number;
  attributeId: number;
  value: string | null;
  numericValue: number | null;
  booleanValue: boolean | null;
  dateValue: Date | null;
  jsonValue: any;
  createdAt: Date;
  updatedAt: Date;
  attribute?: {
    id: number;
    name: string;
    key: string;
    type: AttributeType;
    dataType: AttributeDataType;
    unit: string | null;
    options: any;
  };
  constructor(partial: Partial<ListingAttributeResponseDto>);
}
export declare class BulkListingAttributesDto {
  attributes: CreateListingAttributeDto[];
}
export declare class ValidateAttributeValueDto {
  attributeId: number;
  value: string;
}
export declare class AttributeFilterDto {
  key: string;
  value?: string;
  minValue?: number;
  maxValue?: number;
  booleanValue?: boolean;
  values?: string[];
}
export declare class EnhancedSearchListingsDto {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  attributeFilters?: AttributeFilterDto[];
  page?: number;
  limit?: number;
}
