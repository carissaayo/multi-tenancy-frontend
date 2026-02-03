'use client';

import { Message } from '@/lib/api/messages';
import { useAuthStore } from '@/store/auth-store';
import { format } from 'date-fns';
import { MoreVertical, Smile, Reply, Bookmark, FileText, Image as ImageIcon, File, Download } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MessageItemProps {
  message: Message;
  /** When true, hides action buttons (e.g. workspace deactivated) */
  disabled?: boolean;
}

export function MessageItem({ message, disabled = false }: MessageItemProps) {
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
                <span className="text-xs text-muted-foreground italic">(edited)</span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(message.createdAt)}
              </span>
              <span className="font-semibold text-sm text-primary">
                You
              </span>
            </div>

            {/* Message Body */}
            <div className="relative">
              <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm w-fit max-w-full">
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>

              {/* Floating Action Buttons - positioned at the start of the message */}
              {showActions && !disabled && (
                <div className="absolute -top-10 left-0 bg-card border border-border rounded-lg shadow-lg flex items-center divide-x divide-border z-10">
                  <button
                    className="p-2 hover:bg-muted rounded-l-lg transition-colors cursor-pointer"
                    title="Add reaction"
                  >
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted transition-colors cursor-pointer"
                    title="Reply in thread"
                  >
                    <Reply className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted transition-colors cursor-pointer"
                    title="Save message"
                  >
                    <Bookmark className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-r-lg transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                    className="flex items-center gap-3 p-3 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-all group/attachment max-w-sm"
                  >
                    <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      {getFileIcon(attachment.filename)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover/attachment:text-primary">
                        {attachment.filename}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-muted-foreground">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                    <Download className="w-4 h-4 text-primary group-hover/attachment:text-primary/90 shrink-0" />
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
            <span className="font-semibold text-sm text-foreground">
              {message.user.fullName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>

          {/* Message Body */}
          <div className="relative">
            <div className="bg-card border border-border px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm w-fit max-w-full">
              <div className="text-card-foreground text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>

            {/* Floating Action Buttons - positioned at the end of the message */}
            {showActions && (
              <div className="absolute -top-10 right-0 bg-card border border-border rounded-lg shadow-lg flex items-center divide-x divide-border z-10">
                <button
                  className="p-2 hover:bg-muted rounded-l-lg transition-colors cursor-pointer"
                  title="Add reaction"
                >
                  <Smile className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  className="p-2 hover:bg-muted transition-colors cursor-pointer"
                  title="Reply in thread"
                >
                  <Reply className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  className="p-2 hover:bg-muted transition-colors cursor-pointer"
                  title="Save message"
                >
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  className="p-2 hover:bg-muted rounded-r-lg transition-colors cursor-pointer"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all group/attachment max-w-sm"
                >
                  <div className="shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    {getFileIcon(attachment.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover/attachment:text-primary">
                      {attachment.filename}
                    </p>
                    {attachment.size && (
                      <p className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover/attachment:text-primary shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}