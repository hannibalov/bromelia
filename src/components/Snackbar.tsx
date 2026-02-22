import React, { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isOpen: boolean;
  duration?: number;
  onClose?: () => void;
}

export default function Snackbar({ 
  message, 
  type = 'info', 
  isOpen, 
  duration = 3000, 
  onClose 
}: SnackbarProps) {
  useEffect(() => {
    if (isOpen && duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  };

  return (
    <div className="fixed top-12 left-0 right-0 px-4 md:top-24 md:left-1/2 md:-translate-x-1/2 md:w-auto md:px-0 z-50 animate-bounce flex justify-center">
      <div className={`${bgColors[type]} w-full md:w-auto text-white px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 border-2 border-white`}>
        <span className="text-xl font-bold">
            {type === 'info' && '📢'}
            {type === 'success' && '✅'}
            {type === 'warning' && '⚠️'}
            {type === 'error' && '❌'}
        </span>
        <span className="font-semibold text-lg">{message}</span>
      </div>
    </div>
  );
}
