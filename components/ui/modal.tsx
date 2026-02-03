'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-2xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
