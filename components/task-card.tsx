import { Task, O, pipe } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { TaskActions } from '@/components/task-actions';
import { TaskDetailModal } from '@/components/task-detail-modal';
import { getPriorityColor, getStatusColor } from '@/lib/common/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  variant?: 'board' | 'list';
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, variant = 'board', onTaskUpdate }: TaskCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const isOverdue = pipe(
    task.dueDate,
    O.map(date => date < new Date() && task.status !== 'completed'),
    O.getOrElse(() => false)
  );

  if (variant === 'list') {
    return (
      <>
        <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 group cursor-pointer" onClick={() => setIsDetailModalOpen(true)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {task.title}
                  </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm truncate mb-2">{task.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{pipe(task.assigneeId, O.fold(() => 'Unassigned', () => 'Assigned'))}</span>
                </div>
                {pipe(
                  task.dueDate,
                  O.fold(
                    () => null,
                    date => (
                      <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>Due {date.toLocaleDateString()}</span>
                      </div>
                    )
                  )
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {task.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="secondary" className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
              <TaskActions task={task} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TaskDetailModal
        task={task}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdate={onTaskUpdate}
      />
      </>
    );
  }

  return (
    <>
      <Card 
        className={cn(
          "hover:shadow-lg transition-all duration-200 border group cursor-pointer",
          isOverdue 
            ? "border-red-200 bg-red-50/30" 
            : "border-gray-200 hover:border-blue-300",
          task.status === 'completed' && "opacity-75"
        )}
        onClick={() => setIsDetailModalOpen(true)}
      >
        <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-5">
              {task.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <div className={cn(
              "w-2 h-2 rounded-full",
              task.priority === 'urgent' && "bg-red-500",
              task.priority === 'high' && "bg-orange-500", 
              task.priority === 'medium' && "bg-yellow-500",
              task.priority === 'low' && "bg-green-500"
            )} />
            <TaskActions task={task} />
          </div>
        </div>
        
        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-4">
            {task.description}
          </p>
        )}
        
        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate">
              {pipe(task.assigneeId, O.fold(() => 'Unassigned', () => 'Assigned'))}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {pipe(
              task.dueDate,
              O.fold(
                () => null,
                date => (
                  <div className={cn(
                    "flex items-center gap-1",
                    isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'
                  )}>
                    {isOverdue && <AlertCircle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {(task.priority === 'urgent' || task.priority === 'high') && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
    
    <TaskDetailModal
      task={task}
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      onUpdate={onTaskUpdate}
    />
    </>
  );
}
