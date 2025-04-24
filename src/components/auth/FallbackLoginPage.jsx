import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A simple fallback login page that will be shown if the main login page fails to load
 * @param {Object} props
 * @param {Function} props.onRetry - Function to call when the user wants to retry loading the login page
 */
const FallbackLoginPage = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We're experiencing some technical difficulties.
          </p>
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">
            We're having trouble loading the login page. Please try again later or contact support if the problem persists.
          </span>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Return to Home Page
          </Link>

          <button
            onClick={() => onRetry ? onRetry() : window.location.reload()}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallbackLoginPage;
