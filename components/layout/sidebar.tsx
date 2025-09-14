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
    <div className="h-[calc(100vh-4rem)] bg-white flex flex-col border-r border-gray-200">
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Current Project
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-4 group hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">{currentProject}</div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-600 mb-3">Active • 5 members • 23 tasks</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">J</span>
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">A</span>
                </div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">M</span>
                </div>
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">+2</span>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200" variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Create Issue
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Planning
          </div>
          {navigationItems.slice(0, 4).map(renderNavigationItem)}
          
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6 px-1">
            Development
          </div>
          {navigationItems.slice(4).map(renderNavigationItem)}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Recent Projects
          </div>
          <div className="space-y-2">
            <div className="flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
              <span className="flex-1 truncate">E-commerce Platform</span>
              <div className="text-xs text-gray-400">12 tasks</div>
            </div>
            <div className="flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
              <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <span className="flex-1 truncate">Mobile App Redesign</span>
              <div className="text-xs text-gray-400">8 tasks</div>
            </div>
            <div className="flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
              <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
              <span className="flex-1 truncate">API Integration</span>
              <div className="text-xs text-gray-400">15 tasks</div>
            </div>
          </div>
        </div>
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
