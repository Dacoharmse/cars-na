'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    };

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
      eventId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    // Auto-retry for component-level errors after 5 seconds
    if (this.props.level === 'component') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.handleReset();
      }, 5000);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey)) {
        this.handleReset();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.handleReset();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleReset = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, eventId: undefined });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'component' } = this.props;
      const { error, eventId } = this.state;

      // Different UI based on error level
      switch (level) {
        case 'page':
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
              <div className="max-w-md w-full">
                <div className="text-center mb-8">
                  <div className="mx-auto h-24 w-24 text-red-500 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                  <p className="text-gray-600 mb-6">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                </div>

                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription>
                    {process.env.NODE_ENV === 'development' ? (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {error?.message}
                          {'\n\n'}
                          {error?.stack}
                        </pre>
                      </details>
                    ) : (
                      <p className="text-sm">
                        Error ID: {eventId}
                        <br />
                        Please contact support if this problem persists.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button onClick={this.handleReset} className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={this.handleReload} variant="outline" className="flex-1">
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>
          );

        case 'section':
          return (
            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-4">
                <div className="h-6 w-6 text-red-500 mr-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800">Section Error</h3>
              </div>
              <p className="text-red-700 mb-4">
                This section couldn't load properly. You can try refreshing or continue using other parts of the page.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-red-800">
                    Development Details
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-2 rounded border text-red-600 overflow-auto">
                    {error?.message}
                  </pre>
                </details>
              )}
              <Button onClick={this.handleReset} size="sm" variant="outline">
                Retry Section
              </Button>
            </div>
          );

        default: // component level
          return (
            <div className="p-4 border border-yellow-200 rounded bg-yellow-50">
              <div className="flex items-center mb-2">
                <div className="h-4 w-4 text-yellow-600 mr-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-yellow-800">Component Error</span>
              </div>
              <p className="text-xs text-yellow-700 mb-2">
                Something went wrong with this component. Auto-retrying...
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details>
                  <summary className="cursor-pointer text-xs text-yellow-600">Show Error</summary>
                  <pre className="mt-1 text-xs bg-white p-1 rounded text-yellow-600 overflow-auto">
                    {error?.message}
                  </pre>
                </details>
              )}
            </div>
          );
      }
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Convenience components for different levels
export const PageErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="page" />
);

export const SectionErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="section" />
);

export const ComponentErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="component" />
);

// Hook for manual error reporting
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Manual Error Report:', errorDetails);
    }

    // Here you could send to error monitoring service
    // Example: Sentry.captureException(error, { extra: errorDetails });
  }, []);

  return { handleError };
};