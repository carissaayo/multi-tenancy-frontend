'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/utils/api-error';

export interface ErrorDisplayProps {
  /** The error from useQuery or catch block */
  error: unknown;
  /** Fallback message when error message cannot be extracted */
  fallback?: string;
  /** Title shown above the message */
  title?: string;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Layout variant */
  variant?: 'full' | 'compact' | 'inline';
  /** Optional class name for the container */
  className?: string;
}

export function ErrorDisplay({
  error,
  fallback = 'Something went wrong',
  title = 'Error',
  onRetry,
  variant = 'full',
  className = '',
}: ErrorDisplayProps) {
  const message = getErrorMessage(error, fallback);

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col items-center gap-2 p-4 text-center ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-600">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="cursor-pointer">
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="cursor-pointer">
          Retry
        </Button>
      )}
    </div>
  );
}
