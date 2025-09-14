'use client';

import { Task, TaskStatus, O, pipe } from '@/lib/types';
import { TaskCard } from '@/components/task-card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: readonly Task[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const statusColumns: Array<{
  status: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
}> = [
  {
    status: 'todo',
    title: 'To Do',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50'
  },
  {
    status: 'in_progress', 
    title: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  {
    status: 'completed',
    title: 'Done',
    color: 'text-green-700',
    bgColor: 'bg-green-50'
  }
];

const groupTasksByStatus = (tasks: readonly Task[]) =>
  pipe(
    statusColumns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.status === column.status)
    })),
    columns => columns
  );

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const columns = groupTasksByStatus(tasks);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
        {columns.map((column) => (
          <div
            key={column.status}
            className={cn(
              "rounded-lg border border-gray-200 flex flex-col",
              column.bgColor
            )}
          >
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={cn("font-semibold", column.color)}>
                    {column.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                </div>
                {column.status === 'todo' && (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
                {column.status === 'in_progress' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                {column.status === 'completed' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {column.tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <div className="w-8 h-8 mb-2 opacity-40">
                      {column.status === 'todo' && (
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {column.status === 'in_progress' && (
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                      {column.status === 'completed' && (
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">
                      {column.status === 'todo' && 'No tasks to do'}
                      {column.status === 'in_progress' && 'No tasks in progress'}
                      {column.status === 'completed' && 'No completed tasks'}
                    </span>
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <div key={task.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                      <TaskCard task={task} variant="board" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-600 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-700">
            {tasks.filter(t => t.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-700">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-600 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-700">
            {tasks.filter(t => pipe(
              t.dueDate,
              O.map(date => date < new Date() && t.status !== 'completed'),
              O.getOrElse(() => false)
            )).length}
          </div>
        </div>
      </div>
    </div>
  );
}
