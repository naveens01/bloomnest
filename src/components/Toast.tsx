import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 sm:top-20 sm:right-4 sm:left-auto sm:translate-x-0 z-50 animate-slide-in-right max-w-md w-[calc(100%-2rem)] sm:w-auto`}
    >
      <div className={`${colors[type]} border rounded-xl shadow-lg p-4 flex items-start space-x-3`}>
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${iconColors[type]} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 sm:top-20 sm:right-4 sm:left-auto sm:translate-x-0 z-50 space-y-2 w-full sm:w-auto px-4 sm:px-0">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onClose(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;

