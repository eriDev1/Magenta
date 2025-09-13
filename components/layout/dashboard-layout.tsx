import { Card } from '@/components/ui/card';
import { StatCardProps } from '@/lib/types';

export function DashboardLayout({ sidebar, header, main, stats }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        {header}
      </header>
      
      <div className="flex">
        <aside className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 min-h-screen shadow-sm">
          {sidebar}
        </aside>
        
        <main className="flex-1 p-8">
          {stats && (
            <div className="mb-8">
              {stats}
            </div>
          )}
          <div className="space-y-6">
            {main}
          </div>
        </main>
      </div>
    </div>
  );
}


export function StatCard({ title, value, subtitle, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900',
    green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-900',
    yellow: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-900',
    red: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100 text-red-900',
    gray: 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900',
  };

  const iconClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  };

  return (
    <Card className={`p-6 ${colorClasses[color]} border-2 hover:shadow-lg transition-all duration-200 group`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-sm font-semibold opacity-90">{title}</div>
          {subtitle && (
            <div className="text-xs opacity-75 mt-1">{subtitle}</div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform ${iconClasses[color]}`}>
          <div className="w-6 h-6 bg-current rounded-full opacity-20"></div>
        </div>
      </div>
    </Card>
  );
}
