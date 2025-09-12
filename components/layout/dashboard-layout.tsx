import { Card } from '@/components/ui/card';
import { StatCardProps } from '@/lib/types';

export function DashboardLayout({ sidebar, header, main, stats }: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {header}
      </header>
      
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          {sidebar}
        </aside>
        
        <main className="flex-1 p-6">
          {stats && (
            <div className="mb-6">
              {stats}
            </div>
          )}
          {main}
        </main>
      </div>
    </div>
  );
}


export function StatCard({ title, value, subtitle, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50',
    gray: 'border-gray-200 bg-gray-50',
  };

  return (
    <Card className={`p-4 ${colorClasses[color]}`}>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </Card>
  );
}
