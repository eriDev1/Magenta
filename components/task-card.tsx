import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { getPriorityColor, getStatusColor } from '@/lib/common/constants';

export function TaskCard({ task }: { task: Task }) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in_progress':
        return 60;
      case 'todo':
        return 0;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">{getPriorityIcon(task.priority)}</span>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="secondary" className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{getStatusProgress(task.status)}%</span>
          </div>
          <Progress value={getStatusProgress(task.status)} className="h-2" />
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>Assignee</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate.toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
