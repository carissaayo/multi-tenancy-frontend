'use client';

import { Message } from '@/lib/api/messages';
import { useAuthStore } from '@/store/auth-store';
import { format } from 'date-fns';
import { MoreVertical, Smile, Reply, Bookmark, FileText, Image as ImageIcon, File, Download } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { user: currentUser } = useAuthStore();
  const [showActions, setShowActions] = useState(false);
  const isOwnMessage = currentUser?.id === message.user.id;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, 'h:mm a');
      } else if (diffInHours < 168) {
        return format(date, 'EEE h:mm a');
      } else {
        return format(date, 'MMM d, yyyy h:mm a');
      }
    } catch {
      return dateString;
    }
  };

  // Generate consistent color for avatar based on user ID
  const getAvatarColor = (userId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
    ];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (['pdf'].includes(ext || '')) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  // Own message (right-aligned)
  if (isOwnMessage) {
    return (
      <div className="px-4 py-2 flex justify-end">
        <div
          className="group relative flex gap-3 max-w-[70%] flex-row-reverse"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Avatar */}
          <div className="shrink-0">
            {message.user.avatarUrl ? (
              <Image
                src={message.user.avatarUrl}
                alt={message.user.fullName}
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAvatarColor(message.user.id)} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                {message.user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="flex flex-col items-end min-w-0">
            {/* Header */}
            <div className="flex items-baseline gap-2 mb-1 justify-end">
              {message.isEdited && (
                <span className="text-xs text-gray-400 italic">(edited)</span>
              )}
              <span className="text-xs text-gray-500">
                {formatDate(message.createdAt)}
              </span>
              <span className="font-semibold text-sm text-purple-600">
                You
              </span>
            </div>

            {/* Message Body */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm w-fit max-w-full">
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>

              {/* Floating Action Buttons - positioned at the start of the message */}
              {showActions && (
                <div className="absolute -top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center divide-x divide-gray-200 z-10">
                  <button
                    className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors cursor-pointer"
                    title="Add reaction"
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Reply in thread"
                  >
                    <Reply className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Save message"
                  >
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2 flex flex-col items-end">
                {message.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-100 transition-all group/attachment max-w-sm"
                  >
                    <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-purple-600">
                      {getFileIcon(attachment.filename)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-purple-900 truncate group-hover/attachment:text-purple-700">
                        {attachment.filename}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-purple-600">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                    <Download className="w-4 h-4 text-purple-600 group-hover/attachment:text-purple-700 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Other user's message (left-aligned)
  return (
    <div className="px-4 py-2">
      <div
        className="group relative flex gap-3 max-w-[70%]"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Avatar */}
        <div className="shrink-0">
          {message.user.avatarUrl ? (
            <Image
              src={message.user.avatarUrl}
              alt={message.user.fullName}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAvatarColor(message.user.id)} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
              {message.user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col items-start min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900">
              {message.user.fullName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-gray-400 italic">(edited)</span>
            )}
          </div>

          {/* Message Body */}
          <div className="relative">
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm w-fit max-w-full">
              <div className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>

            {/* Floating Action Buttons - positioned at the end of the message */}
            {showActions && (
              <div className="absolute -top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center divide-x divide-gray-200 z-10">
                <button
                  className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors cursor-pointer"
                  title="Add reaction"
                >
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Reply in thread"
                >
                  <Reply className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Save message"
                >
                  <Bookmark className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group/attachment max-w-sm"
                >
                  <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                    {getFileIcon(attachment.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover/attachment:text-blue-600">
                      {attachment.filename}
                    </p>
                    {attachment.size && (
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover/attachment:text-blue-600 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}