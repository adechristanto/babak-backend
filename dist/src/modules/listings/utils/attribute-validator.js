"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValidator = void 0;
const client_1 = require("@prisma/client");
class AttributeValidator {
    static validateAttribute(attributeDef, attributeValue) {
        const errors = [];
        if (attributeDef.required && this.isEmpty(attributeValue)) {
            errors.push(`${attributeDef.name} is required`);
            return { isValid: false, errors };
        }
        if (this.isEmpty(attributeValue)) {
            return { isValid: true, errors: [] };
        }
        switch (attributeDef.dataType) {
            case client_1.AttributeDataType.STRING:
                this.validateStringValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeDataType.INTEGER:
                this.validateIntegerValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeDataType.DECIMAL:
                this.validateDecimalValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeDataType.BOOLEAN:
                this.validateBooleanValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeDataType.DATE:
                this.validateDateValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeDataType.JSON:
                this.validateJsonValue(attributeDef, attributeValue, errors);
                break;
        }
        switch (attributeDef.type) {
            case client_1.AttributeType.SELECT:
                this.validateSelectValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeType.MULTISELECT:
                this.validateMultiselectValue(attributeDef, attributeValue, errors);
                break;
            case client_1.AttributeType.RANGE:
                this.validateRangeValue(attributeDef, attributeValue, errors);
                break;
        }
        return { isValid: errors.length === 0, errors };
    }
    static validateAttributes(attributeDefs, attributeValues) {
        const errors = {};
        let isValid = true;
        const providedAttributes = new Map(attributeValues.map(attr => [attr.attributeId, attr]));
        for (const attributeDef of attributeDefs) {
            const providedValue = providedAttributes.get(attributeDef.id);
            const validation = this.validateAttribute(attributeDef, providedValue || { attributeId: attributeDef.id });
            if (!validation.isValid) {
                errors[attributeDef.key] = validation.errors;
                isValid = false;
            }
        }
        return { isValid, errors };
    }
    static isEmpty(attributeValue) {
        return !attributeValue.value &&
            attributeValue.numericValue === undefined &&
            attributeValue.booleanValue === undefined &&
            !attributeValue.dateValue &&
            !attributeValue.jsonValue;
    }
    static validateStringValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.value;
        if (!value)
            return;
        const validation = attributeDef.validation || {};
        if (validation.minLength && value.length < validation.minLength) {
            errors.push(`${attributeDef.name} must be at least ${validation.minLength} characters`);
        }
        if (validation.maxLength && value.length > validation.maxLength) {
            errors.push(`${attributeDef.name} must be at most ${validation.maxLength} characters`);
        }
        if (validation.pattern) {
            const regex = new RegExp(validation.pattern);
            if (!regex.test(value)) {
                errors.push(`${attributeDef.name} format is invalid`);
            }
        }
    }
    static validateIntegerValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.numericValue;
        if (value === undefined)
            return;
        if (!Number.isInteger(value)) {
            errors.push(`${attributeDef.name} must be a whole number`);
            return;
        }
        const validation = attributeDef.validation || {};
        if (validation.min !== undefined && value < validation.min) {
            errors.push(`${attributeDef.name} must be at least ${validation.min}`);
        }
        if (validation.max !== undefined && value > validation.max) {
            errors.push(`${attributeDef.name} must be at most ${validation.max}`);
        }
    }
    static validateDecimalValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.numericValue;
        if (value === undefined)
            return;
        const validation = attributeDef.validation || {};
        if (validation.min !== undefined && value < validation.min) {
            errors.push(`${attributeDef.name} must be at least ${validation.min}`);
        }
        if (validation.max !== undefined && value > validation.max) {
            errors.push(`${attributeDef.name} must be at most ${validation.max}`);
        }
        if (validation.decimalPlaces !== undefined) {
            const decimalPlaces = (value.toString().split('.')[1] || '').length;
            if (decimalPlaces > validation.decimalPlaces) {
                errors.push(`${attributeDef.name} can have at most ${validation.decimalPlaces} decimal places`);
            }
        }
    }
    static validateBooleanValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.booleanValue;
        if (value === undefined)
            return;
        if (typeof value !== 'boolean') {
            errors.push(`${attributeDef.name} must be true or false`);
        }
    }
    static validateDateValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.dateValue;
        if (!value)
            return;
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            errors.push(`${attributeDef.name} must be a valid date`);
            return;
        }
        const validation = attributeDef.validation || {};
        if (validation.minDate) {
            const minDate = new Date(validation.minDate);
            if (date < minDate) {
                errors.push(`${attributeDef.name} must be after ${minDate.toDateString()}`);
            }
        }
        if (validation.maxDate) {
            const maxDate = new Date(validation.maxDate);
            if (date > maxDate) {
                errors.push(`${attributeDef.name} must be before ${maxDate.toDateString()}`);
            }
        }
    }
    static validateJsonValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.jsonValue;
        if (!value)
            return;
    }
    static validateSelectValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.value;
        if (!value)
            return;
        const options = attributeDef.options;
        if (options && Array.isArray(options)) {
            const validOptions = options.map(opt => typeof opt === 'string' ? opt : opt.value);
            if (!validOptions.includes(value)) {
                errors.push(`${attributeDef.name} must be one of: ${validOptions.join(', ')}`);
            }
        }
    }
    static validateMultiselectValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.jsonValue;
        if (!value)
            return;
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
        if (validation.minSelections && value.length < validation.minSelections) {
            errors.push(`${attributeDef.name} must have at least ${validation.minSelections} selections`);
        }
        if (validation.maxSelections && value.length > validation.maxSelections) {
            errors.push(`${attributeDef.name} must have at most ${validation.maxSelections} selections`);
        }
    }
    static validateRangeValue(attributeDef, attributeValue, errors) {
        const value = attributeValue.jsonValue;
        if (!value)
            return;
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
        if (validation.min !== undefined && minValue < validation.min) {
            errors.push(`${attributeDef.name} minimum value cannot be less than ${validation.min}`);
        }
        if (validation.max !== undefined && maxValue > validation.max) {
            errors.push(`${attributeDef.name} maximum value cannot be greater than ${validation.max}`);
        }
    }
}
exports.AttributeValidator = AttributeValidator;
//# sourceMappingURL=attribute-validator.js.map