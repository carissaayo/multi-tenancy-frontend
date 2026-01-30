'use client';

import { Check, Loader2 } from 'lucide-react';

interface ChannelEditFormProps {
  name: string;
  description: string;
  isPrivate: boolean;
  isSaving: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIsPrivateChange: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ChannelEditForm({
  name,
  description,
  isPrivate,
  isSaving,
  onNameChange,
  onDescriptionChange,
  onIsPrivateChange,
  onSave,
  onCancel,
}: ChannelEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Channel Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="private"
          checked={isPrivate}
          onChange={(e) => onIsPrivateChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />
        <label htmlFor="private" className="text-sm text-gray-700">
          Make this channel private
        </label>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
