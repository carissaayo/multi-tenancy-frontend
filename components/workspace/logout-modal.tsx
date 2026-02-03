'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onConfirm: (logoutFromAllDevices: boolean) => void;
  onCancel: () => void;
}

export function LogoutModal({
  isOpen,
  isLoggingOut,
  onConfirm,
  onCancel,
}: LogoutModalProps) {
  const [logoutFromAllDevices, setLogoutFromAllDevices] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(logoutFromAllDevices);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">Log out?</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          You will be signed out of this device. Your session will be invalidated on the server.
        </p>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={logoutFromAllDevices}
            onChange={(e) => setLogoutFromAllDevices(e.target.checked)}
            disabled={isLoggingOut}
            className="rounded border-border text-primary focus:ring-ring cursor-pointer"
          />
          <span className="text-sm text-foreground">Log out of all devices</span>
        </label>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="flex-1 cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Log out'
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
