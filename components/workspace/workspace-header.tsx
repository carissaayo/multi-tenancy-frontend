'use client';

import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebar-store';

interface WorkspaceHeaderProps {
  title: string;
}

export function WorkspaceHeader({ title }: WorkspaceHeaderProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </div>
  );
}
