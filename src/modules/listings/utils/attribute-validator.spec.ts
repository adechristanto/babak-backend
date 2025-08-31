import { AttributeValidator, CategoryAttributeDefinition } from './attribute-validator';
import { AttributeType, AttributeDataType } from '@prisma/client';
import { CreateListingAttributeDto } from '../dto/listing-attribute.dto';

describe('AttributeValidator', () => {
  describe('validateAttribute', () => {
    it('should validate required string attribute', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Title',
        key: 'title',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
        required: true,
      };

      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'Test Title',
      };

      const result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required attribute', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Title',
        key: 'title',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
        required: true,
      };

      const emptyValue: CreateListingAttributeDto = {
        attributeId: 1,
      };

      const result = AttributeValidator.validateAttribute(attributeDef, emptyValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should validate string length constraints', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Description',
        key: 'description',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
        required: false,
        validation: { minLength: 10, maxLength: 100 },
      };

      // Too short
      const shortValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'Short',
      };

      let result = AttributeValidator.validateAttribute(attributeDef, shortValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be at least 10 characters');

      // Too long
      const longValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'a'.repeat(101),
      };

      result = AttributeValidator.validateAttribute(attributeDef, longValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be at most 100 characters');

      // Valid length
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'This is a valid description with proper length',
      };

      result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);
    });

    it('should validate integer values', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Bedrooms',
        key: 'bedrooms',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: true,
        validation: { min: 1, max: 10 },
      };

      // Valid integer
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 3,
      };

      let result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);

      // Non-integer
      const decimalValue: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 3.5,
      };

      result = AttributeValidator.validateAttribute(attributeDef, decimalValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bedrooms must be a whole number');

      // Out of range
      const outOfRangeValue: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 15,
      };

      result = AttributeValidator.validateAttribute(attributeDef, outOfRangeValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bedrooms must be at most 10');
    });

    it('should validate decimal values', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Area',
        key: 'area',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.DECIMAL,
        required: true,
        validation: { min: 0.1, max: 1000, decimalPlaces: 2 },
      };

      // Valid decimal
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 125.50,
      };

      let result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);

      // Too many decimal places
      const tooManyDecimals: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 125.555,
      };

      result = AttributeValidator.validateAttribute(attributeDef, tooManyDecimals);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Area can have at most 2 decimal places');
    });

    it('should validate boolean values', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Pet Allowed',
        key: 'pet_allowed',
        type: AttributeType.BOOLEAN,
        dataType: AttributeDataType.BOOLEAN,
        required: false,
      };

      // Valid boolean true
      const trueValue: CreateListingAttributeDto = {
        attributeId: 1,
        booleanValue: true,
      };

      let result = AttributeValidator.validateAttribute(attributeDef, trueValue);
      expect(result.isValid).toBe(true);

      // Valid boolean false
      const falseValue: CreateListingAttributeDto = {
        attributeId: 1,
        booleanValue: false,
      };

      result = AttributeValidator.validateAttribute(attributeDef, falseValue);
      expect(result.isValid).toBe(true);
    });

    it('should validate select options', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Condition',
        key: 'condition',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.STRING,
        required: true,
        options: ['new', 'like_new', 'good', 'fair', 'poor'],
      };

      // Valid option
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'good',
      };

      let result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);

      // Invalid option
      const invalidValue: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'excellent',
      };

      result = AttributeValidator.validateAttribute(attributeDef, invalidValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Condition must be one of: new, like_new, good, fair, poor');
    });

    it('should validate multiselect options', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Features',
        key: 'features',
        type: AttributeType.MULTISELECT,
        dataType: AttributeDataType.JSON,
        required: false,
        options: ['wifi', 'parking', 'pool', 'gym'],
        validation: { minSelections: 1, maxSelections: 3 },
      };

      // Valid selection
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        jsonValue: ['wifi', 'parking'],
      };

      let result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);

      // Invalid option
      const invalidValue: CreateListingAttributeDto = {
        attributeId: 1,
        jsonValue: ['wifi', 'invalid_option'],
      };

      result = AttributeValidator.validateAttribute(attributeDef, invalidValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Features contains invalid values: invalid_option');

      // Too many selections
      const tooManyValue: CreateListingAttributeDto = {
        attributeId: 1,
        jsonValue: ['wifi', 'parking', 'pool', 'gym'],
      };

      result = AttributeValidator.validateAttribute(attributeDef, tooManyValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Features must have at most 3 selections');
    });

    it('should validate date values', () => {
      const attributeDef: CategoryAttributeDefinition = {
        id: 1,
        name: 'Built Date',
        key: 'built_date',
        type: AttributeType.DATE,
        dataType: AttributeDataType.DATE,
        required: false,
        validation: { 
          minDate: '2000-01-01',
          maxDate: new Date().toISOString().split('T')[0]
        },
      };

      // Valid date
      const validValue: CreateListingAttributeDto = {
        attributeId: 1,
        dateValue: '2020-05-15',
      };

      let result = AttributeValidator.validateAttribute(attributeDef, validValue);
      expect(result.isValid).toBe(true);

      // Invalid date format
      const invalidValue: CreateListingAttributeDto = {
        attributeId: 1,
        dateValue: 'invalid-date',
      };

      result = AttributeValidator.validateAttribute(attributeDef, invalidValue);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Built Date must be a valid date');

      // Date too early
      const tooEarlyValue: CreateListingAttributeDto = {
        attributeId: 1,
        dateValue: '1999-01-01',
      };

      result = AttributeValidator.validateAttribute(attributeDef, tooEarlyValue);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Built Date must be after');
    });
  });

  describe('validateAttributes', () => {
    it('should validate multiple attributes', () => {
      const attributeDefs: CategoryAttributeDefinition[] = [
        {
          id: 1,
          name: 'Title',
          key: 'title',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
        },
        {
          id: 2,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          validation: { min: 1, max: 10 },
        },
      ];

      const attributeValues: CreateListingAttributeDto[] = [
        { attributeId: 1, value: 'Test Property' },
        { attributeId: 2, numericValue: 3 },
      ];

      const result = AttributeValidator.validateAttributes(attributeDefs, attributeValues);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should return errors for invalid attributes', () => {
      const attributeDefs: CategoryAttributeDefinition[] = [
        {
          id: 1,
          name: 'Title',
          key: 'title',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
        },
        {
          id: 2,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          validation: { min: 1, max: 10 },
        },
      ];

      const attributeValues: CreateListingAttributeDto[] = [
        { attributeId: 2, numericValue: 15 }, // Missing title, invalid bedrooms
      ];

      const result = AttributeValidator.validateAttributes(attributeDefs, attributeValues);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain('Title is required');
      expect(result.errors.bedrooms).toContain('Bedrooms must be at most 10');
    });
  });
});
