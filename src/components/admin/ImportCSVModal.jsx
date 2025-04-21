import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileUpload,
  faFileExcel,
  faFileCsv,
  faTimes,
  faExclamationTriangle,
  faCheckCircle,
  faDownload,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { readCSVFile, validateImportData } from '../../utils/importUtils';
import { downloadCSV } from '../../utils/exportUtils';

const ImportCSVModal = ({
  isOpen,
  onClose,
  onImport,
  headers,
  validationSchema,
  templateData = [],
  entityName = 'items',
  maxFileSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [step, setStep] = useState('upload'); // upload, validate, review, complete
  const fileInputRef = useRef(null);
  
  // Reset the state when the modal is opened/closed
  const resetState = () => {
    setFile(null);
    setIsLoading(false);
    setError(null);
    setImportData(null);
    setValidationResults(null);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    
    // Check file size
    if (selectedFile.size > maxFileSize) {
      setError(`File size exceeds the maximum limit of ${maxFileSize / 1024 / 1024}MB`);
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
      setStep('validate');
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
    
    try {
      const results = validateImportData(importData, validationSchema);
      setValidationResults(results);
      setStep('review');
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
      setStep('complete');
    } catch (error) {
      console.error('Error importing data:', error);
      setError('Failed to import the data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  // Download template
  const handleDownloadTemplate = () => {
    downloadCSV(templateData, headers, `${entityName.toLowerCase()}-import-template`);
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
    
    downloadCSV(errorData, errorHeaders, `${entityName.toLowerCase()}-import-errors`);
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                {step === 'upload' && <FontAwesomeIcon icon={faFileUpload} className="h-6 w-6 text-blue-600" />}
                {step === 'validate' && <FontAwesomeIcon icon={faFileCsv} className="h-6 w-6 text-blue-600" />}
                {step === 'review' && <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-yellow-600" />}
                {step === 'complete' && <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {step === 'upload' && `Import ${entityName}`}
                  {step === 'validate' && 'Validate Data'}
                  {step === 'review' && 'Review Import'}
                  {step === 'complete' && 'Import Complete'}
                </h3>
                
                {/* Upload Step */}
                {step === 'upload' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a CSV file to import {entityName.toLowerCase()}. 
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
                          <FontAwesomeIcon icon={faFileCsv} className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept=".csv"
                                className="sr-only"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            CSV file up to {maxFileSize / 1024 / 1024}MB
                          </p>
                        </div>
                      </div>
                      
                      {file && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FontAwesomeIcon icon={faFileCsv} className="mr-2 text-green-500" />
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </div>
                      )}
                    </div>
                    
                    {error && (
                      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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
                  </div>
                )}
                
                {/* Validate Step */}
                {step === 'validate' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      {importData?.length || 0} records found in the CSV file. 
                      Click "Validate" to check the data for errors.
                    </p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Validation will check for required fields, data types, and other constraints.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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
                  </div>
                )}
                
                {/* Review Step */}
                {step === 'review' && validationResults && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {validationResults.validItems.length} of {importData?.length || 0} records are valid.
                        </p>
                        {validationResults.invalidItems.length > 0 && (
                          <p className="text-sm text-red-500">
                            {validationResults.invalidItems.length} records have errors.
                          </p>
                        )}
                      </div>
                      
                      {validationResults.invalidItems.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDownloadErrors}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-2" />
                          Download Errors
                        </button>
                      )}
                    </div>
                    
                    {validationResults.invalidItems.length > 0 ? (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Some records have errors. You can proceed with importing only the valid records,
                              or download the error report to fix the issues and try again.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              All records are valid and ready to import.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {validationResults.invalidItems.length > 0 && (
                      <div className="mt-4 max-h-60 overflow-y-auto">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Error Summary:</h4>
                        <ul className="text-sm text-red-600 list-disc pl-5 space-y-1">
                          {validationResults.errors.slice(0, 10).flatMap(error => 
                            error.messages.map((message, i) => (
                              <li key={`${error.rowIndex}-${i}`}>{message}</li>
                            ))
                          )}
                          {validationResults.errors.length > 10 && (
                            <li className="text-gray-500">
                              ...and {validationResults.errors.length - 10} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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
                  </div>
                )}
                
                {/* Complete Step */}
                {step === 'complete' && (
                  <div className="mt-4">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Successfully imported {validationResults?.validItems.length || 0} {entityName.toLowerCase()}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 'upload' && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Next'}
              </button>
            )}
            
            {step === 'validate' && (
              <button
                type="button"
                onClick={handleValidate}
                disabled={!importData || isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Validating...' : 'Validate'}
              </button>
            )}
            
            {step === 'review' && (
              <button
                type="button"
                onClick={handleImport}
                disabled={!validationResults || validationResults.validItems.length === 0 || isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Importing...' : `Import ${validationResults?.validItems.length || 0} ${entityName.toLowerCase()}`}
              </button>
            )}
            
            {step === 'complete' && (
              <button
                type="button"
                onClick={handleClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Done
              </button>
            )}
            
            {step !== 'complete' && (
              <button
                type="button"
                onClick={step === 'review' ? () => setStep('validate') : step === 'validate' ? () => setStep('upload') : handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {step === 'upload' ? 'Cancel' : 'Back'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
