'use client';

import { Menu, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebar-store';

interface WorkspaceHeaderProps {
  title: string;
  /** Optional: back navigates here instead of router.back() */
  backHref?: string;
}

export function WorkspaceHeader({ title, backHref }: WorkspaceHeaderProps) {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  const handleBack = () => {
    setSidebarOpen(false);
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <div className="sticky top-0 z-10 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="sm:hidden shrink-0 hover:bg-muted rounded-lg transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden sm:flex lg:hidden hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
        <h1 className="text-lg md:text-xl font-bold text-foreground truncate">{title}</h1>
      </div>
    </div>
  );
}
