import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getPriorityColor, getStatusColor } from '@/lib/common/constants';

export function TaskCard({ task }: { task: Task }) {

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="flex gap-2">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
        </div>
      </div>
      <p className="text-gray-600 text-sm">{task.description}</p>
    </Card>
  );
}
