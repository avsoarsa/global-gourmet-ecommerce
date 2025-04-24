import React from 'react';

/**
 * A simple error boundary component that catches errors in its children
 */
class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by SimpleErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback ? 
        this.props.fallback({ 
          error: this.state.error, 
          resetErrorBoundary: () => this.setState({ hasError: false, error: null }) 
        }) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-4">We're sorry, but there was an error loading this page.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
