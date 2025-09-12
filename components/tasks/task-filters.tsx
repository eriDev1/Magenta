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
    <div className="bg-white p-4 border-b border-gray-200 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
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
                className="text-xs"
              >
                {status.replace('_', ' ')} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
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
                className="text-xs"
              >
                {priority} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {currentFilter.status?.map(status => (
            <Badge key={status} variant="secondary" className="text-xs">
              {status}
              <button
                onClick={() => toggleStatus(status)}
                className="ml-1 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {currentFilter.priority?.map(priority => (
            <Badge key={priority} variant="secondary" className="text-xs">
              {priority}
              <button
                onClick={() => togglePriority(priority)}
                className="ml-1 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
