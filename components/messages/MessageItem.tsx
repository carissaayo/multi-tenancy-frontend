'use client';

import { Message } from '@/lib/api/messages';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return format(date, 'HH:mm');
      } else if (diffInHours < 168) {
        return format(date, 'EEE HH:mm');
      } else {
        return format(date, 'MMM d, yyyy HH:mm');
      }
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg group">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {message.user.fullName.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">
            {message.user.fullName}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(message.createdAt)}
          </span>
          {message.edited && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>
        <div className="text-gray-700 whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline text-sm"
              >
                📎 {attachment.filename}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
