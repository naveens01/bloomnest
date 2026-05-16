import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-eco-50 to-nature-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-eco-glow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-8">
                We're sorry for the inconvenience. An unexpected error occurred while loading this page.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                  <p className="text-sm text-red-700 font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-600">
                      <summary className="cursor-pointer font-semibold mb-2">
                        Stack Trace
                      </summary>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-64 p-2 bg-red-100 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 bg-eco-600 text-white rounded-xl hover:bg-eco-700 transition-colors duration-300 shadow-eco-glow"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-eco-600 border-2 border-eco-600 rounded-xl hover:bg-eco-50 transition-colors duration-300"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Made with Bob