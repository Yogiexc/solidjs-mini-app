import { ErrorBoundary as SolidErrorBoundary } from 'solid-js';
import { JSX } from 'solid-js';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

interface ErrorBoundaryProps {
  children: JSX.Element;
}

function ErrorFallback(err: Error, reset: () => void) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-red-100 rounded-full p-3">
            <svg 
              class="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800">
            Oops! Something went wrong
          </h2>
        </div>
        
        <div class="bg-red-50 rounded p-4 mb-4">
          <p class="text-sm font-semibold text-red-800 mb-2">Error Message:</p>
          <p class="text-sm text-red-700 font-mono break-words">
            {err.message}
          </p>
        </div>
        
        <details class="mb-4">
          <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            View Stack Trace
          </summary>
          <pre class="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {err.stack}
          </pre>
        </details>
        
        <button
          onClick={reset}
          class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Try Again
        </button>
        
        <p class="mt-3 text-xs text-gray-500 text-center">
          If the problem persists, please contact support
        </p>
      </div>
    </div>
  );
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SolidErrorBoundary fallback={ErrorFallback}>
      {props.children}
    </SolidErrorBoundary>
  );
}