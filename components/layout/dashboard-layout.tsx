import { Card } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { StatCardProps } from '@/lib/types';
import { getColorConfig } from '@/lib/common/constants';

export function DashboardLayout({ sidebar, header, main, stats }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        {header}
      </header>
      
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
        <ResizablePanel defaultSize={25} minSize={8} maxSize={40} className="min-w-[180px]">
          <aside className="h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-r border-gray-200 overflow-y-auto scrollbar-thin">
            {sidebar}
          </aside>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors group">
          <div className="w-4 h-12 bg-white border border-gray-300 rounded-md shadow-modern group-hover:border-gray-400 group-hover:shadow-modern-lg transition-all flex items-center justify-center">
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </ResizableHandle>
        
        <ResizablePanel defaultSize={75} minSize={60}>
          <main className="h-full p-6 overflow-auto scrollbar-thin bg-gradient-to-br from-gray-50/50 via-white/50 to-gray-50/50">
            {stats && (
              <div className="mb-6 animate-fade-in">
                {stats}
              </div>
            )}
            <div className="space-y-6 animate-fade-in">
              {main}
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function StatCard({ title, value, subtitle, color = 'blue' }: StatCardProps) {
  const config = getColorConfig(color);

  return (
    <Card className={`p-6 ${config.bg} ${config.border} border hover:shadow-modern-lg transition-all duration-200 group relative overflow-hidden`}>
      {/* Gradient overlay for modern look */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className={`text-3xl font-bold ${config.text} mb-1 group-hover:scale-105 transition-transform`}>
            {value}
          </div>
          <div className={`text-sm font-semibold ${config.text} opacity-90`}>{title}</div>
          {subtitle && (
            <div className={`text-xs ${config.text} opacity-75 mt-1`}>{subtitle}</div>
          )}
        </div>
        <div className={`w-12 h-12 ${config.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-md`}>
          <div className={`w-6 h-6 ${config.accent} rounded-lg opacity-80 group-hover:opacity-100 transition-opacity`}></div>
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.accent} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
    </Card>
  );
}
