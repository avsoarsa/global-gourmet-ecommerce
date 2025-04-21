/**
 * Utility functions for exporting data to CSV and Excel
 */

/**
 * Convert an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects with 'label' and 'key' properties
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, headers) => {
  if (!data || !data.length || !headers || !headers.length) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item[header.key];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '""';
      } else if (typeof value === 'string') {
        // Escape quotes in strings
        return `"${value.replace(/"/g, '""')}"`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        return `"${value}"`;
      } else if (value instanceof Date) {
        return `"${value.toISOString()}"`;
      } else if (typeof value === 'object') {
        // Convert objects to JSON strings
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      return `"${value}"`;
    }).join(',');
  }).join('\\n');
  
  return `${headerRow}\\n${rows}`;
};

/**
 * Download data as a CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects with 'label' and 'key' properties
 * @param {string} filename - Name of the file to download (without extension)
 */
export const downloadCSV = (data, headers, filename = 'export') => {
  const csv = convertToCSV(data, headers);
  
  // Create a Blob with the CSV data
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add link to the document
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Format date for Excel export
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDateForExcel = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) return date; // Return original if invalid date
  
  return d.toLocaleDateString();
};

/**
 * Format currency for Excel export
 * @param {number} value - Value to format
 * @param {string} currencySymbol - Currency symbol to use
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value, currencySymbol = '$') => {
  if (value === null || value === undefined) return '';
  
  return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
};

/**
 * Download data as an Excel file (CSV with Excel formatting)
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects with 'label', 'key', and optional 'format' properties
 * @param {string} filename - Name of the file to download (without extension)
 */
export const downloadExcel = (data, headers, filename = 'export') => {
  if (!data || !data.length || !headers || !headers.length) {
    console.error('No data or headers provided for Excel export');
    return;
  }
  
  // Process data with formatting
  const processedData = data.map(item => {
    const row = {};
    
    headers.forEach(header => {
      const value = item[header.key];
      
      // Apply formatting based on header format type
      if (header.format === 'date') {
        row[header.key] = formatDateForExcel(value);
      } else if (header.format === 'currency') {
        row[header.key] = formatCurrency(value, header.currencySymbol);
      } else if (header.format === 'number') {
        row[header.key] = value !== null && value !== undefined ? parseFloat(value) : '';
      } else if (header.format === 'boolean') {
        row[header.key] = value ? 'Yes' : 'No';
      } else if (typeof header.format === 'function') {
        // Custom formatter function
        row[header.key] = header.format(value, item);
      } else {
        row[header.key] = value;
      }
    });
    
    return row;
  });
  
  // Create CSV with the processed data
  const csv = convertToCSV(processedData, headers);
  
  // Add Excel UTF-8 BOM for proper character encoding
  const bom = '\uFEFF';
  const excelCsv = bom + csv;
  
  // Create a Blob with the CSV data
  const blob = new Blob([excelCsv], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  
  // Add link to the document
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data in the specified format
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects
 * @param {string} filename - Name of the file to download (without extension)
 * @param {string} format - Export format ('csv' or 'excel')
 */
export const exportData = (data, headers, filename, format = 'csv') => {
  if (format === 'csv') {
    downloadCSV(data, headers, filename);
  } else if (format === 'excel') {
    downloadExcel(data, headers, filename);
  } else {
    console.error(`Unsupported export format: ${format}`);
  }
};

export default {
  convertToCSV,
  downloadCSV,
  downloadExcel,
  exportData
};
