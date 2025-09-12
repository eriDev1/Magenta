'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Settings,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentProject?: string;
}

export function Sidebar({ currentProject = "My Project" }: SidebarProps) {
  const pathname = usePathname();
  
  const navigationItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/team', icon: Users, label: 'Team' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Current Project
        </div>
        <div className="text-sm font-medium text-gray-900 mb-3">{currentProject}</div>
        <Button size="sm" className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Quick Filters
        </div>
        <div className="space-y-1 text-sm">
          <Link href="/tasks?filter=assigned" className="block px-3 py-1 text-gray-600 hover:text-gray-900">
            Assigned to me
          </Link>
          <Link href="/tasks?filter=overdue" className="block px-3 py-1 text-gray-600 hover:text-gray-900">
            Overdue tasks
          </Link>
          <Link href="/tasks?filter=high-priority" className="block px-3 py-1 text-gray-600 hover:text-gray-900">
            High priority
          </Link>
          <Link href="/tasks?filter=completed" className="block px-3 py-1 text-gray-600 hover:text-gray-900">
            Completed today
          </Link>
        </div>
      </div>
    </div>
  );
}
