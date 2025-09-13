export type ColorVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export const colorConfigs: Record<ColorVariant, {
  bg: string;
  border: string;
  text: string;
  accent: string;
  icon: string;
}> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    accent: 'text-blue-600',
    icon: 'bg-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    accent: 'text-green-600',
    icon: 'bg-green-100'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    accent: 'text-yellow-600',
    icon: 'bg-yellow-100'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    accent: 'text-red-600',
    icon: 'bg-red-100'
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    icon: 'bg-gray-100'
  }
};

export const getColorConfig = (variant: ColorVariant) => colorConfigs[variant];

export const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    urgent: 'bg-red-200 text-red-900 border-red-300',
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return priorityMap[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    todo: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const navigationItems = [
  { href: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
  { href: '/tasks', icon: 'CheckSquare', label: 'Tasks' },
  { href: '/projects', icon: 'FolderOpen', label: 'Projects' },
  { href: '/team', icon: 'Users', label: 'Team' },
  { href: '/analytics', icon: 'BarChart3', label: 'Analytics' },
  { href: '/settings', icon: 'Settings', label: 'Settings' }
] as const;

export const quickActions = [
  { href: '/tasks?filter=assigned', icon: 'Star', label: 'My Tasks', color: 'yellow' },
  { href: '/tasks?filter=overdue', icon: 'AlertCircle', label: 'Overdue', color: 'red' }
] as const;