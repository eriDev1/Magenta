import { Card } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { StatCardProps } from '@/lib/types';
import { getColorConfig } from '@/lib/common/constants';

export function DashboardLayout({ sidebar, header, main, stats }: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {header}
      </header>
      
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
        <ResizablePanel defaultSize={25} minSize={8} maxSize={40} className="min-w-[180px]">
          <aside className="h-[calc(100vh-4rem)] bg-white border-r overflow-y-auto">
            {sidebar}
          </aside>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors group">
          <div className="w-4 h-12 bg-white border border-gray-300 rounded-md shadow-sm group-hover:border-gray-400 group-hover:shadow-md transition-all flex items-center justify-center">
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </ResizableHandle>
        
        <ResizablePanel defaultSize={75} minSize={60}>
          <main className="h-full p-6 overflow-auto">
            {stats && (
              <div className="mb-6">
                {stats}
              </div>
            )}
            <div className="space-y-4">
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
    <Card className={`p-6 ${config.bg} ${config.border} border-2 hover:shadow-lg transition-all duration-200 group`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold ${config.text} mb-1`}>{value}</div>
          <div className={`text-sm font-semibold ${config.text} opacity-90`}>{title}</div>
          {subtitle && (
            <div className={`text-xs ${config.text} opacity-75 mt-1`}>{subtitle}</div>
          )}
        </div>
        <div className={`w-12 h-12 ${config.icon} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <div className={`w-6 h-6 ${config.accent} rounded-full opacity-60`}></div>
        </div>
      </div>
    </Card>
  );
}
