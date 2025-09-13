'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Settings,
  Plus,
  Star,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface SidebarProps {
  currentProject?: string;
}

export function Sidebar({ currentProject = "My Project" }: SidebarProps) {
  const pathname = usePathname();
  
  const navigationItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard', count: 12 },
    { href: '/tasks', icon: CheckSquare, label: 'Tasks', count: 8 },
    { href: '/projects', icon: FolderOpen, label: 'Projects', count: 3 },
    { href: '/team', icon: Users, label: 'Team', count: 5 },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const quickFilters = [
    { href: '/tasks?filter=assigned', icon: Star, label: 'Assigned to me', count: 5 },
    { href: '/tasks?filter=overdue', icon: AlertCircle, label: 'Overdue tasks', count: 2, urgent: true },
    { href: '/tasks?filter=high-priority', icon: Clock, label: 'High priority', count: 3 },
    { href: '/tasks?filter=completed', icon: CheckSquare, label: 'Completed today', count: 4 },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Current Project
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="text-sm font-semibold text-gray-900 mb-1">{currentProject}</div>
            <div className="text-xs text-gray-600 mb-2">Active • 5 members</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-1.5" />
            </div>
          </div>
          <Button size="sm" className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  {item.label}
                </div>
                {item.count && (
                  <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Filters
          </div>
          <div className="space-y-1">
            {quickFilters.map((filter) => (
              <Link
                key={filter.href}
                href={filter.href}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <filter.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                  {filter.label}
                </div>
                <div className="flex items-center gap-1">
                  {filter.urgent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Mageta v1.0.0
        </div>
      </div>
    </div>
  );
}
