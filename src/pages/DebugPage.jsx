import { useState, useEffect } from 'react';

const DebugPage = () => {
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      setLogs(prev => [...prev, { type: 'log', message: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev, { type: 'error', message: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleError(...args);
    };

    console.warn = (...args) => {
      setLogs(prev => [...prev, { type: 'warn', message: args.map(arg => JSON.stringify(arg)).join(' ') }]);
      originalConsoleWarn(...args);
    };

    // Capture global errors
    const handleError = (event) => {
      setError(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);

    // Test currency service
    const testCurrencyService = async () => {
      try {
        const currencyModule = await import('../services/currencyService');
        console.log('Currency service loaded successfully');
        
        try {
          const rates = await currencyModule.fetchExchangeRates();
          console.log('Exchange rates fetched:', rates);
        } catch (err) {
          console.error('Error fetching exchange rates:', err.message);
        }
      } catch (err) {
        console.error('Error loading currency service:', err.message);
      }
    };

    testCurrencyService();

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Console Output:</h2>
        <div className="bg-black text-white p-4 rounded font-mono text-sm h-96 overflow-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                [{log.type}] {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
