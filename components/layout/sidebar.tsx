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
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigationItems, quickActions } from '@/lib/common/constants';

interface SidebarProps {
  currentProject?: string;
}

const iconMap = {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  Settings,
  BarChart3,
  Star,
  AlertCircle
} as const;

const getIcon = (iconName: string) => iconMap[iconName as keyof typeof iconMap];

export function Sidebar({ currentProject = "My Project" }: SidebarProps) {
  const pathname = usePathname();
  
  const renderNavigationItem = (item: (typeof navigationItems)[number]) => {
    const Icon = getIcon(item.icon);
    const isActive = pathname === item.href;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
          ${isActive 
            ? 'bg-blue-100 text-blue-700 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
        {item.label}
      </Link>
    );
  };

  const renderQuickAction = (action: (typeof quickActions)[number]) => {
    const Icon = getIcon(action.icon);
    const colorClass = action.color === 'yellow' ? 'group-hover:text-yellow-500' : 'group-hover:text-red-500';
    
    return (
      <Link
        key={action.href}
        href={action.href}
        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
      >
        <Icon className={`w-4 h-4 mr-3 text-gray-400 ${colorClass}`} />
        {action.label}
      </Link>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Current Project
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 mb-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">{currentProject}</div>
            <div className="text-xs text-gray-600">Active • 5 members</div>
          </div>
          <Button size="sm" className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map(renderNavigationItem)}
        </nav>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Access
        </div>
        <div className="space-y-1">
          {quickActions.map(renderQuickAction)}
        </div>
      </div>
    </div>
  );
}
