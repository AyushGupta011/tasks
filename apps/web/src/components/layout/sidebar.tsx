'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Mechanics', href: '/mechanics', icon: Wrench },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out',
          'bg-card border-r border-border',
          'lg:relative lg:translate-x-0',
          isOpen ? 'w-[260px] translate-x-0' : 'w-[260px] -translate-x-full lg:w-[72px] lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 shrink-0">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span
            className={cn(
              'text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent whitespace-nowrap transition-opacity duration-200',
              !isOpen && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
            )}
          >
            Instant Mechanic
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after click
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span
                  className={cn(
                    'whitespace-nowrap transition-opacity duration-200',
                    !isOpen && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center p-3 mx-3 mb-4 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </aside>
    </>
  );
}
