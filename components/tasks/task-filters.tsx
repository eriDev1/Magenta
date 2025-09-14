import { TaskFilter, TaskStatus, TaskPriority, O } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Separator } from '@/components/ui/separator';
import { X, Filter, Search, Calendar, User, Flag, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  };
}

const createFilterToggle =
  (key: keyof TaskFilter) =>
  (currentFilter: TaskFilter, onFilterChange: (filter: TaskFilter) => void) =>
  (value: string) => {
    const currentValues = Array.isArray(currentFilter[key])
      ? (currentFilter[key] as string[])
      : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...currentFilter,
      [key]: newValues.length > 0 ? newValues : undefined,
    });
  };


const hasActiveFilters = (filter: TaskFilter) =>
  Object.keys(filter).some((key) => filter[key as keyof TaskFilter] !== undefined);

const renderFilterButton = (
  key: string,
  label: string,
  count: number,
  isActive: boolean,
  onClick: () => void
) => (
  <Button
    key={key}
    variant={isActive ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    className="text-xs"
  >
    {label} ({count})
  </Button>
);



export function TaskFilters({
  currentFilter,
  onFilterChange,
  taskCounts,
}: TaskFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const statusEntries = Object.entries(taskCounts.byStatus) as [TaskStatus, number][];
  const priorityEntries = Object.entries(taskCounts.byPriority) as [TaskPriority, number][];

  const clearFilters = () => {
    onFilterChange({
      status: O.none,
      priority: O.none,
      assigneeId: O.none,
      search: O.none,
      overdue: false
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => 
    O.isSome(currentFilter.status) || 
    O.isSome(currentFilter.priority) || 
    O.isSome(currentFilter.assigneeId) || 
    O.isSome(currentFilter.search) || 
    currentFilter.overdue;

  const updateStatus = (status: TaskStatus | null) => {
    onFilterChange({
      ...currentFilter,
      status: status ? O.some(status) : O.none
    });
  };

  const updatePriority = (priority: TaskPriority | null) => {
    onFilterChange({
      ...currentFilter,
      priority: priority ? O.some(priority) : O.none
    });
  };

  const updateSearch = (search: string) => {
    setSearchQuery(search);
    onFilterChange({
      ...currentFilter,
      search: search ? O.some(search) : O.none
    });
  };

  const toggleOverdue = () => {
    onFilterChange({
      ...currentFilter,
      overdue: !currentFilter.overdue
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filters</span>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="text-xs">
                {[
                  O.isSome(currentFilter.status) ? 1 : 0,
                  O.isSome(currentFilter.priority) ? 1 : 0,
                  O.isSome(currentFilter.assigneeId) ? 1 : 0,
                  O.isSome(currentFilter.search) ? 1 : 0,
                  currentFilter.overdue ? 1 : 0
                ].reduce((a, b) => a + b, 0)} active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="text-xs"
            >
              Advanced
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusEntries.map(([status, count]) => (
            <Button
              key={status}
              variant={O.isSome(currentFilter.status) && O.getOrElse(() => null)(currentFilter.status as any) === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateStatus(O.isSome(currentFilter.status) && O.getOrElse(() => null)(currentFilter.status as any) === status ? null : status)}
              className="text-xs h-8"
            >
              {status.replace('_', ' ')} ({count})
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-8" />
          
          {priorityEntries.map(([priority, count]) => (
            <Button
              key={priority}
              variant={O.isSome(currentFilter.priority) && O.getOrElse(() => null)(currentFilter.priority as any) === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => updatePriority(O.isSome(currentFilter.priority) && O.getOrElse(() => null)(currentFilter.priority as any) === priority ? null : priority)}
              className="text-xs h-8"
            >
              <Flag className="w-3 h-3 mr-1" />
              {priority} ({count})
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button
            variant={currentFilter.overdue ? 'default' : 'outline'}
            size="sm"
            onClick={toggleOverdue}
            className="text-xs h-8"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Overdue
          </Button>
        </div>
      </div>

      {isAdvancedOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Status</label>
              <Select 
                value={O.getOrElse(() => 'all')(currentFilter.status)} 
                onValueChange={(value) => updateStatus(value === 'all' ? null : value as TaskStatus)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Priority</label>
              <Select 
                value={O.getOrElse(() => 'all')(currentFilter.priority)} 
                onValueChange={(value) => updatePriority(value === 'all' ? null : value as TaskPriority)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee Dropdown */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Assignee</label>
              <Select value="all">
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any assignee</SelectItem>
                  <SelectItem value="me">Assigned to me</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="alice">Alice Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Saved Views</span>
              <Button variant="ghost" size="sm" className="text-xs">
                <Bookmark className="w-3 h-3 mr-1" />
                Save current view
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                My Tasks
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                High Priority
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                This Week
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters() && (
        <div className="p-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-medium">
                Showing {taskCounts.total} filtered tasks
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3 mr-1" />
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
