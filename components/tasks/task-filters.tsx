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

const toggleStatus = createFilterToggle('status');
const togglePriority = createFilterToggle('priority');

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

const renderActiveFilter = (key: string, label: string, onRemove: () => void) => (
  <Badge key={key} variant="secondary" className="text-xs">
    {label}
    <button onClick={onRemove} className="ml-1 hover:text-gray-700">
      <X className="w-3 h-3" />
    </button>
  </Badge>
);

export function TaskFilters({
  currentFilter,
  onFilterChange,
  taskCounts,
}: TaskFiltersProps) {
  const statusEntries = Object.entries(taskCounts.byStatus) as [TaskStatus, number][];
  const priorityEntries = Object.entries(taskCounts.byPriority) as [TaskPriority, number][];

  const clearFilters = () => onFilterChange({});
  const hasFilters = hasActiveFilters(currentFilter);

  // helper: safely get array from filter
  const getArray = (value: unknown) => (Array.isArray(value) ? value : []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="space-y-4">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusEntries.map(([status, count]) => {
              const isActive = getArray(currentFilter.status).includes(status);
              return renderFilterButton(
                status,
                status.replace('_', ' '),
                count,
                isActive,
                () => toggleStatus(currentFilter, onFilterChange)(status)
              );
            })}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
          <div className="flex flex-wrap gap-2">
            {priorityEntries.map(([priority, count]) => {
              const isActive = getArray(currentFilter.priority).includes(priority);
              return renderFilterButton(
                priority,
                priority,
                count,
                isActive,
                () => togglePriority(currentFilter, onFilterChange)(priority)
              );
            })}
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active filters:</span>

            {getArray(currentFilter.status).map((status) =>
              renderActiveFilter(
                status,
                status.replace('_', ' '),
                () => toggleStatus(currentFilter, onFilterChange)(status)
              )
            )}

            {getArray(currentFilter.priority).map((priority) =>
              renderActiveFilter(
                priority,
                priority,
                () => togglePriority(currentFilter, onFilterChange)(priority)
              )
            )}

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
    </div>
  );
}
