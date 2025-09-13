import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { getPriorityColor, getStatusColor } from '@/lib/common/constants';

export function TaskCard({ task }: { task: Task }) {
  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="secondary" className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{task.description}</p>
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Assignee</span>
          </div>
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
              <Calendar className="w-3 h-3" />
              <span>Due {task.dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
