'use client';

import { AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DangerZoneSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
      </div>

      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
        <div>
          <h3 className="font-semibold text-red-600">Delete Account</h3>
          <p className="text-sm text-red-500">
            Permanently delete your account and all associated data
          </p>
        </div>
        <Button variant="destructive" className="cursor-pointer">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
