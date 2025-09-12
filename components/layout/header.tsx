import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Mageta
        </Link>
        <span className="text-sm text-gray-500">Task Management Platform</span>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search tasks, projects, or people..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
        
        <ThemeSwitcher />
        
        {user ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
        ) : (
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
