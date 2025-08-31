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

export class AttributeValidator {
  /**
   * Validates a single attribute value against its definition
   */
  static validateAttribute(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if required attribute is provided
    if (attributeDef.required && this.isEmpty(attributeValue)) {
      errors.push(`${attributeDef.name} is required`);
      return { isValid: false, errors };
    }

    // Skip validation if value is empty and not required
    if (this.isEmpty(attributeValue)) {
      return { isValid: true, errors: [] };
    }

    // Validate based on data type
    switch (attributeDef.dataType) {
      case AttributeDataType.STRING:
        this.validateStringValue(attributeDef, attributeValue, errors);
        break;
      case AttributeDataType.INTEGER:
        this.validateIntegerValue(attributeDef, attributeValue, errors);
        break;
      case AttributeDataType.DECIMAL:
        this.validateDecimalValue(attributeDef, attributeValue, errors);
        break;
      case AttributeDataType.BOOLEAN:
        this.validateBooleanValue(attributeDef, attributeValue, errors);
        break;
      case AttributeDataType.DATE:
        this.validateDateValue(attributeDef, attributeValue, errors);
        break;
      case AttributeDataType.JSON:
        this.validateJsonValue(attributeDef, attributeValue, errors);
        break;
    }

    // Validate based on attribute type (UI component type)
    switch (attributeDef.type) {
      case AttributeType.SELECT:
        this.validateSelectValue(attributeDef, attributeValue, errors);
        break;
      case AttributeType.MULTISELECT:
        this.validateMultiselectValue(attributeDef, attributeValue, errors);
        break;
      case AttributeType.RANGE:
        this.validateRangeValue(attributeDef, attributeValue, errors);
        break;
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates multiple attributes for a listing
   */
  static validateAttributes(
    attributeDefs: CategoryAttributeDefinition[],
    attributeValues: CreateListingAttributeDto[]
  ): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    // Create a map of provided attributes by attributeId
    const providedAttributes = new Map(
      attributeValues.map(attr => [attr.attributeId, attr])
    );

    // Validate each attribute definition
    for (const attributeDef of attributeDefs) {
      const providedValue = providedAttributes.get(attributeDef.id);
      const validation = this.validateAttribute(
        attributeDef,
        providedValue || { attributeId: attributeDef.id }
      );

      if (!validation.isValid) {
        errors[attributeDef.key] = validation.errors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  private static isEmpty(attributeValue: CreateListingAttributeDto): boolean {
    return !attributeValue.value && 
           attributeValue.numericValue === undefined && 
           attributeValue.booleanValue === undefined && 
           !attributeValue.dateValue && 
           !attributeValue.jsonValue;
  }

  private static validateStringValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.value;
    if (!value) return;

    const validation = attributeDef.validation || {};

    // Check minimum length
    if (validation.minLength && value.length < validation.minLength) {
      errors.push(`${attributeDef.name} must be at least ${validation.minLength} characters`);
    }

    // Check maximum length
    if (validation.maxLength && value.length > validation.maxLength) {
      errors.push(`${attributeDef.name} must be at most ${validation.maxLength} characters`);
    }

    // Check pattern
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        errors.push(`${attributeDef.name} format is invalid`);
      }
    }
  }

  private static validateIntegerValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.numericValue;
    if (value === undefined) return;

    // Check if it's actually an integer
    if (!Number.isInteger(value)) {
      errors.push(`${attributeDef.name} must be a whole number`);
      return;
    }

    const validation = attributeDef.validation || {};

    // Check minimum value
    if (validation.min !== undefined && value < validation.min) {
      errors.push(`${attributeDef.name} must be at least ${validation.min}`);
    }

    // Check maximum value
    if (validation.max !== undefined && value > validation.max) {
      errors.push(`${attributeDef.name} must be at most ${validation.max}`);
    }
  }

  private static validateDecimalValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.numericValue;
    if (value === undefined) return;

    const validation = attributeDef.validation || {};

    // Check minimum value
    if (validation.min !== undefined && value < validation.min) {
      errors.push(`${attributeDef.name} must be at least ${validation.min}`);
    }

    // Check maximum value
    if (validation.max !== undefined && value > validation.max) {
      errors.push(`${attributeDef.name} must be at most ${validation.max}`);
    }

    // Check decimal places
    if (validation.decimalPlaces !== undefined) {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > validation.decimalPlaces) {
        errors.push(`${attributeDef.name} can have at most ${validation.decimalPlaces} decimal places`);
      }
    }
  }

  private static validateBooleanValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.booleanValue;
    if (value === undefined) return;

    // Boolean values are inherently valid if provided
    if (typeof value !== 'boolean') {
      errors.push(`${attributeDef.name} must be true or false`);
    }
  }

  private static validateDateValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.dateValue;
    if (!value) return;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push(`${attributeDef.name} must be a valid date`);
      return;
    }

    const validation = attributeDef.validation || {};

    // Check minimum date
    if (validation.minDate) {
      const minDate = new Date(validation.minDate);
      if (date < minDate) {
        errors.push(`${attributeDef.name} must be after ${minDate.toDateString()}`);
      }
    }

    // Check maximum date
    if (validation.maxDate) {
      const maxDate = new Date(validation.maxDate);
      if (date > maxDate) {
        errors.push(`${attributeDef.name} must be before ${maxDate.toDateString()}`);
      }
    }
  }

  private static validateJsonValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.jsonValue;
    if (!value) return;

    // Basic JSON validation is handled by the DTO transformation
    // Additional custom validation can be added here based on the attribute definition
  }

  private static validateSelectValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.value;
    if (!value) return;

    const options = attributeDef.options;
    if (options && Array.isArray(options)) {
      const validOptions = options.map(opt => typeof opt === 'string' ? opt : opt.value);
      if (!validOptions.includes(value)) {
        errors.push(`${attributeDef.name} must be one of: ${validOptions.join(', ')}`);
      }
    }
  }

  private static validateMultiselectValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.jsonValue;
    if (!value) return;

    if (!Array.isArray(value)) {
      errors.push(`${attributeDef.name} must be an array of values`);
      return;
    }

    const options = attributeDef.options;
    if (options && Array.isArray(options)) {
      const validOptions = options.map(opt => typeof opt === 'string' ? opt : opt.value);
      const invalidValues = value.filter(v => !validOptions.includes(v));
      if (invalidValues.length > 0) {
        errors.push(`${attributeDef.name} contains invalid values: ${invalidValues.join(', ')}`);
      }
    }

    const validation = attributeDef.validation || {};
    
    // Check minimum selections
    if (validation.minSelections && value.length < validation.minSelections) {
      errors.push(`${attributeDef.name} must have at least ${validation.minSelections} selections`);
    }

    // Check maximum selections
    if (validation.maxSelections && value.length > validation.maxSelections) {
      errors.push(`${attributeDef.name} must have at most ${validation.maxSelections} selections`);
    }
  }

  private static validateRangeValue(
    attributeDef: CategoryAttributeDefinition,
    attributeValue: CreateListingAttributeDto,
    errors: string[]
  ): void {
    const value = attributeValue.jsonValue;
    if (!value) return;

    if (typeof value !== 'object' || !value.min || !value.max) {
      errors.push(`${attributeDef.name} must have both min and max values`);
      return;
    }

    const minValue = parseFloat(value.min);
    const maxValue = parseFloat(value.max);

    if (isNaN(minValue) || isNaN(maxValue)) {
      errors.push(`${attributeDef.name} min and max values must be numbers`);
      return;
    }

    if (minValue >= maxValue) {
      errors.push(`${attributeDef.name} min value must be less than max value`);
    }

    const validation = attributeDef.validation || {};

    // Check overall range limits
    if (validation.min !== undefined && minValue < validation.min) {
      errors.push(`${attributeDef.name} minimum value cannot be less than ${validation.min}`);
    }

    if (validation.max !== undefined && maxValue > validation.max) {
      errors.push(`${attributeDef.name} maximum value cannot be greater than ${validation.max}`);
    }
  }
}
