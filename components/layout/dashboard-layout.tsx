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
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="min-w-[240px]">
          <aside className="h-full bg-white border-r border-gray-200">
            {sidebar}
          </aside>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-1 bg-gray-200 hover:bg-blue-300 transition-colors group">
          <div className="w-3 h-8 bg-white border border-gray-300 rounded-sm shadow-sm group-hover:border-blue-400 group-hover:shadow-md transition-all flex items-center justify-center">
            <div className="w-1 h-4 bg-gray-400 group-hover:bg-blue-500 transition-colors rounded-sm"></div>
          </div>
        </ResizableHandle>
        
        <ResizablePanel defaultSize={80} minSize={65}>
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
