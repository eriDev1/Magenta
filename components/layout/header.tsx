import Link from 'next/link';
import { Search, Bell, User, Plus, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Mageta</span>
            <div className="text-xs text-gray-500 -mt-1">Task Management</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-lg mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search tasks, projects, or people..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="relative group">
          <Bell className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>
        
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
        
        <ThemeSwitcher />
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-3 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    john.doe@mageta.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
