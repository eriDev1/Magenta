import { TaskFilter, TaskStatus, TaskPriority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  };
}

export function TaskFilters({ currentFilter, onFilterChange, taskCounts }: TaskFiltersProps) {
  
  const toggleStatus = (status: TaskStatus) => {
    const currentStatuses = currentFilter.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFilterChange({
      ...currentFilter,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = currentFilter.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFilterChange({
      ...currentFilter,
      priority: newPriorities.length > 0 ? newPriorities : undefined
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(currentFilter).some(key => 
    currentFilter[key as keyof TaskFilter] !== undefined
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Filter by Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(taskCounts.byStatus) as TaskStatus[]).map(status => {
              const isActive = currentFilter.status?.includes(status) || false;
              const count = taskCounts.byStatus[status];
              
              return (
                <Button
                  key={status}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStatus(status)}
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                      : 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {status.replace('_', ' ')} 
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Filter by Priority
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(taskCounts.byPriority) as TaskPriority[]).map(priority => {
              const isActive = currentFilter.priority?.includes(priority) || false;
              const count = taskCounts.byPriority[priority];
              
              return (
                <Button
                  key={priority}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePriority(priority)}
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md' 
                      : 'hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  {priority}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            <div className="flex flex-wrap gap-2">
              {currentFilter.status?.map(status => (
                <Badge key={status} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                  {status.replace('_', ' ')}
                  <button
                    onClick={() => toggleStatus(status)}
                    className="ml-1 hover:text-blue-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {currentFilter.priority?.map(priority => (
                <Badge key={priority} variant="secondary" className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
                  {priority}
                  <button
                    onClick={() => togglePriority(priority)}
                    className="ml-1 hover:text-purple-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
