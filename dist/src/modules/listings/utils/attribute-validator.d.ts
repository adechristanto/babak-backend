import { AttributeType, AttributeDataType } from '@prisma/client';
import { CreateListingAttributeDto } from '../dto/listing-attribute.dto';
export interface CategoryAttributeDefinition {
    id: number;
    name: string;
    key: string;
    type: AttributeType;
    dataType: AttributeDataType;
    required: boolean;
    options?: any;
    validation?: any;
    unit?: string | null;
}
export declare class AttributeValidator {
    static validateAttribute(attributeDef: CategoryAttributeDefinition, attributeValue: CreateListingAttributeDto): {
        isValid: boolean;
        errors: string[];
    };
    static validateAttributes(attributeDefs: CategoryAttributeDefinition[], attributeValues: CreateListingAttributeDto[]): {
        isValid: boolean;
        errors: Record<string, string[]>;
    };
    private static isEmpty;
    private static validateStringValue;
    private static validateIntegerValue;
    private static validateDecimalValue;
    private static validateBooleanValue;
    private static validateDateValue;
    private static validateJsonValue;
    private static validateSelectValue;
    private static validateMultiselectValue;
    private static validateRangeValue;
}
