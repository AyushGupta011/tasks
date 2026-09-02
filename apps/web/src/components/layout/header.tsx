'use client';

import { usePathname } from 'next/navigation';
import { Menu, Wifi, WifiOff } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useSocket } from '@/hooks/use-socket';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/bookings': 'Bookings',
  '/analytics': 'Analytics',
  '/mechanics': 'Mechanics',
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { isConnected } = useSocket();
  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Live connection indicator */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors',
            isConnected
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-red-500/10 text-red-500'
          )}
        >
          {isConnected ? (
            <>
              <Wifi className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Offline</span>
            </>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
