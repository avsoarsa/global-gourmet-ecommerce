/**
 * Utility functions for importing data from CSV files
 */

/**
 * Parse CSV string to array of objects
 * @param {string} csvString - CSV string to parse
 * @param {Array} headers - Array of header objects with 'label' and 'key' properties
 * @param {Object} options - Parsing options
 * @returns {Array} Array of objects
 */
export const parseCSV = (csvString, headers, options = {}) => {
  if (!csvString || !headers || !headers.length) {
    return [];
  }

  const {
    delimiter = ',',
    hasHeaderRow = true,
    skipEmptyLines = true,
  } = options;

  // Split the CSV string into lines
  const lines = csvString.split(/\\r?\\n/);
  
  // Skip empty lines if specified
  const nonEmptyLines = skipEmptyLines 
    ? lines.filter(line => line.trim() !== '') 
    : lines;
  
  // Skip header row if specified
  const dataLines = hasHeaderRow ? nonEmptyLines.slice(1) : nonEmptyLines;
  
  // Parse each line into an object
  return dataLines.map(line => {
    // Split the line by delimiter, handling quoted values
    const values = parseCSVLine(line, delimiter);
    const obj = {};
    
    // Map values to object properties using headers
    headers.forEach((header, index) => {
      if (index < values.length) {
        const value = values[index];
        
        // Convert value based on format
        if (header.format === 'number') {
          obj[header.key] = value === '' ? null : parseFloat(value);
        } else if (header.format === 'boolean') {
          obj[header.key] = ['true', 'yes', '1'].includes(value.toLowerCase());
        } else if (header.format === 'date') {
          obj[header.key] = value === '' ? null : new Date(value);
        } else {
          obj[header.key] = value;
        }
      } else {
        obj[header.key] = null;
      }
    });
    
    return obj;
  });
};

/**
 * Parse a CSV line, handling quoted values
 * @param {string} line - CSV line to parse
 * @param {string} delimiter - Delimiter character
 * @returns {Array} Array of values
 */
const parseCSVLine = (line, delimiter) => {
  const values = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of value
      values.push(currentValue);
      currentValue = '';
    } else {
      // Add character to current value
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue);
  
  return values;
};

/**
 * Read a CSV file and parse its contents
 * @param {File} file - CSV file to read
 * @param {Array} headers - Array of header objects with 'label' and 'key' properties
 * @param {Object} options - Parsing options
 * @returns {Promise<Array>} Promise resolving to array of objects
 */
export const readCSVFile = (file, headers, options = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvString = event.target.result;
        const data = parseCSV(csvString, headers, options);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate imported data against a schema
 * @param {Array} data - Array of objects to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation results
 */
export const validateImportData = (data, schema) => {
  const validItems = [];
  const invalidItems = [];
  const errors = [];
  
  data.forEach((item, index) => {
    const itemErrors = [];
    
    // Check required fields
    schema.required?.forEach(field => {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        itemErrors.push({
          field,
          message: `${field} is required`
        });
      }
    });
    
    // Check field types and constraints
    Object.entries(schema.properties || {}).forEach(([field, rules]) => {
      const value = item[field];
      
      // Skip validation if value is empty and not required
      if ((value === undefined || value === null || value === '') && 
          !schema.required?.includes(field)) {
        return;
      }
      
      // Type validation
      if (rules.type && value !== undefined && value !== null) {
        if (rules.type === 'number' && typeof value !== 'number') {
          itemErrors.push({
            field,
            message: `${field} must be a number`
          });
        } else if (rules.type === 'string' && typeof value !== 'string') {
          itemErrors.push({
            field,
            message: `${field} must be a string`
          });
        } else if (rules.type === 'boolean' && typeof value !== 'boolean') {
          itemErrors.push({
            field,
            message: `${field} must be a boolean`
          });
        }
      }
      
      // Min/max validation for numbers
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.minimum !== undefined && value < rules.minimum) {
          itemErrors.push({
            field,
            message: `${field} must be at least ${rules.minimum}`
          });
        }
        if (rules.maximum !== undefined && value > rules.maximum) {
          itemErrors.push({
            field,
            message: `${field} must be at most ${rules.maximum}`
          });
        }
      }
      
      // Min/max length validation for strings
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          itemErrors.push({
            field,
            message: `${field} must be at least ${rules.minLength} characters`
          });
        }
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          itemErrors.push({
            field,
            message: `${field} must be at most ${rules.maxLength} characters`
          });
        }
      }
      
      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        itemErrors.push({
          field,
          message: `${field} must be one of: ${rules.enum.join(', ')}`
        });
      }
      
      // Pattern validation
      if (rules.pattern && typeof value === 'string') {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          itemErrors.push({
            field,
            message: rules.patternMessage || `${field} does not match the required pattern`
          });
        }
      }
      
      // Custom validation
      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, item);
        if (customError) {
          itemErrors.push({
            field,
            message: customError
          });
        }
      }
    });
    
    if (itemErrors.length > 0) {
      invalidItems.push({
        rowIndex: index + 1, // +1 for human-readable row number
        item,
        errors: itemErrors
      });
      
      errors.push({
        rowIndex: index + 1,
        messages: itemErrors.map(err => `Row ${index + 1}: ${err.message}`)
      });
    } else {
      validItems.push(item);
    }
  });
  
  return {
    isValid: invalidItems.length === 0,
    validItems,
    invalidItems,
    errors
  };
};

export default {
  parseCSV,
  readCSVFile,
  validateImportData
};
