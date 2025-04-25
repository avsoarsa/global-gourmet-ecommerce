import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Validate email format
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would call an API to send a password reset email
      // For this demo, we'll just simulate success after a short delay
      setTimeout(() => {
        setIsSubmitted(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 mb-6">
            {isSubmitted ? 'Check your email' : 'Reset your password'}
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            {isSubmitted
              ? 'We\'ve sent a password reset link to your email address.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    If an account exists with the email <strong>{email}</strong>, you will receive a password reset link shortly.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className={`${emailValid && email ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border ${
                    email ? (emailValid ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-red-300 focus:ring-red-500 focus:border-red-500') : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200`}
                  placeholder="you@example.com"
                />
                {email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailValid ? (
                      <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                    ) : (
                      <FontAwesomeIcon icon={faXmark} className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {email && !emailValid && (
                <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !emailValid}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${
                  loading || !emailValid ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
