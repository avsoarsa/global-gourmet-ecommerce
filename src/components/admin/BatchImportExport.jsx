import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImport,
  faFileExport,
  faDownload,
  faUpload,
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { readCSVFile, validateImportData } from '../../utils/importUtils';
import { exportData } from '../../utils/exportUtils';

const BatchImportExport = ({
  onImport,
  data,
  headers,
  validationSchema,
  templateData = [],
  entityName = 'products'
}) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [importStep, setImportStep] = useState('upload'); // upload, validate, review, complete
  
  // Reset import state
  const resetImportState = () => {
    setFile(null);
    setIsLoading(false);
    setError(null);
    setImportData(null);
    setValidationResults(null);
    setImportStep('upload');
  };
  
  // Open import modal
  const openImportModal = () => {
    resetImportState();
    setIsImportModalOpen(true);
  };
  
  // Close import modal
  const closeImportModal = () => {
    setIsImportModalOpen(false);
    resetImportState();
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }
    
    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the maximum limit of 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };
  
  // Handle file upload and parsing
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await readCSVFile(file, headers);
      setImportData(data);
      setImportStep('validate');
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setError('Failed to parse the CSV file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle data validation
  const handleValidate = () => {
    if (!importData) {
      setError('No data to validate');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = validateImportData(importData, validationSchema);
      setValidationResults(results);
      setImportStep('review');
    } catch (error) {
      console.error('Error validating data:', error);
      setError('Failed to validate the data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle data import
  const handleImport = () => {
    if (!validationResults || !validationResults.validItems.length) {
      setError('No valid data to import');
      return;
    }
    
    setIsLoading(true);
    
    try {
      onImport(validationResults.validItems);
      setImportStep('complete');
    } catch (error) {
      console.error('Error importing data:', error);
      setError('Failed to import the data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Download template
  const handleDownloadTemplate = () => {
    exportData(templateData, headers, `${entityName.toLowerCase()}-import-template`, 'csv');
  };
  
  // Download validation errors
  const handleDownloadErrors = () => {
    if (!validationResults || !validationResults.invalidItems.length) {
      return;
    }
    
    const errorHeaders = [
      { label: 'Row', key: 'rowIndex' },
      { label: 'Field', key: 'field' },
      { label: 'Error', key: 'message' }
    ];
    
    const errorData = validationResults.invalidItems.flatMap(item => 
      item.errors.map(error => ({
        rowIndex: item.rowIndex,
        field: error.field,
        message: error.message
      }))
    );
    
    exportData(errorData, errorHeaders, `${entityName.toLowerCase()}-import-errors`, 'csv');
  };
  
  // Export data
  const handleExport = (format = 'csv') => {
    exportData(data, headers, `${entityName.toLowerCase()}-export`, format);
  };
  
  return (
    <div>
      {/* Import/Export Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={openImportModal}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FontAwesomeIcon icon={faFileImport} className="mr-2 text-green-600" />
          Batch Import
        </button>
        
        <div className="relative inline-block text-left">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FontAwesomeIcon icon={faFileExport} className="mr-2 text-green-600" />
            Batch Export
          </button>
        </div>
      </div>
      
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faFileImport} className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Batch Import {entityName}
                    </h3>
                    
                    {/* Error Message */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Step */}
                    {importStep === 'upload' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-4">
                          Upload a CSV file to import {entityName}. 
                          Make sure your file follows the required format.
                        </p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Download Template</span>
                          <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                            Template
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select CSV File
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                  <span>Upload a file</span>
                                  <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    accept=".csv"
                                    onChange={handleFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                CSV file up to 5MB
                              </p>
                            </div>
                          </div>
                          
                          {file && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                              {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Validate Step */}
                    {importStep === 'validate' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-4">
                          File uploaded successfully. The file contains {importData.length} records.
                          Click "Validate Data" to check for any errors.
                        </p>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">File Summary</h4>
                          <ul className="text-sm text-gray-500 space-y-1">
                            <li>Total Records: {importData.length}</li>
                            <li>File Size: {(file.size / 1024).toFixed(2)} KB</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {/* Review Step */}
                    {importStep === 'review' && validationResults && (
                      <div className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Validation Results</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Valid Records:</p>
                              <p className="text-lg font-semibold text-green-600">{validationResults.validItems.length}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Invalid Records:</p>
                              <p className="text-lg font-semibold text-red-600">{validationResults.invalidItems.length}</p>
                            </div>
                          </div>
                        </div>
                        
                        {validationResults.invalidItems.length > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-gray-900">Validation Errors</h4>
                              <button
                                type="button"
                                onClick={handleDownloadErrors}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                Download Errors
                              </button>
                            </div>
                            
                            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {validationResults.invalidItems.slice(0, 5).flatMap(item => 
                                    item.errors.map((error, index) => (
                                      <tr key={`${item.rowIndex}-${index}`}>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.rowIndex}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{error.field}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{error.message}</td>
                                      </tr>
                                    ))
                                  )}
                                  {validationResults.invalidItems.length > 5 && (
                                    <tr>
                                      <td colSpan="3" className="px-3 py-2 text-xs text-center text-gray-500">
                                        ... and {validationResults.invalidItems.length - 5} more errors
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        {validationResults.validItems.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">
                              {validationResults.validItems.length} valid records are ready to import.
                              Click "Import Data" to proceed.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Complete Step */}
                    {importStep === 'complete' && (
                      <div className="mt-4 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Import Successful</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {validationResults.validItems.length} {entityName} have been imported successfully.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {importStep === 'upload' && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isLoading ? 'Uploading...' : 'Upload File'}
                  </button>
                )}
                
                {importStep === 'validate' && (
                  <button
                    type="button"
                    onClick={handleValidate}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isLoading ? 'Validating...' : 'Validate Data'}
                  </button>
                )}
                
                {importStep === 'review' && (
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={isLoading || validationResults.validItems.length === 0}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isLoading ? 'Importing...' : 'Import Data'}
                  </button>
                )}
                
                {importStep === 'complete' && (
                  <button
                    type="button"
                    onClick={closeImportModal}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Done
                  </button>
                )}
                
                {importStep !== 'complete' && (
                  <button
                    type="button"
                    onClick={closeImportModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                )}
                
                {importStep === 'review' && (
                  <button
                    type="button"
                    onClick={() => setImportStep('validate')}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Back
                  </button>
                )}
                
                {importStep === 'validate' && (
                  <button
                    type="button"
                    onClick={() => setImportStep('upload')}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchImportExport;
