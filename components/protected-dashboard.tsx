'use client';

import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Task, TaskFilter, TaskStatus, TaskSummary, TaskPriority, O } from "@/lib/types";

interface DashboardProps {
  user: {
    name: string;
  };
  sampleTasks: Task[];
}

export function Dashboard({ user, sampleTasks }: DashboardProps) {
  const calculateTaskSummary = (tasks: Task[]): TaskSummary => {
    const initialSummary: TaskSummary = {
      total: 0,
      byStatus: {} as Record<TaskStatus, number>,
      byPriority: {} as Record<TaskPriority, number>,
      overdue: 0
    };

    return tasks.reduce((summary, task) => ({
      total: summary.total + 1,
      byStatus: {
        ...summary.byStatus,
        [task.status]: (summary.byStatus[task.status] || 0) + 1
      },
      byPriority: {
        ...summary.byPriority,
        [task.priority]: (summary.byPriority[task.priority] || 0) + 1
      },
      overdue: task.dueDate && task.dueDate instanceof Date && task.dueDate < new Date() && task.status !== 'completed'
        ? summary.overdue + 1
        : summary.overdue
    }), initialSummary);
  };

  const taskSummary = calculateTaskSummary(sampleTasks);
  const currentFilter: TaskFilter = {
    status: O.none,
    priority: O.none,
    assigneeId: O.none,
    search: O.none,
    overdue: false
  };

  return (
    <DashboardLayout
      header={
        <Header 
          user={user} 
        />
      }
      sidebar={
        <Sidebar currentProject="Mageta Development" />
      }
      stats={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Tasks" 
            value={taskSummary.total} 
            color="blue" 
          />
          <StatCard 
            title="In Progress" 
            value={taskSummary.byStatus.in_progress || 0} 
            color="yellow" 
          />
          <StatCard 
            title="Completed" 
            value={taskSummary.byStatus.completed || 0} 
            color="green" 
          />
          <StatCard 
            title="Overdue" 
            value={taskSummary.overdue} 
            color="red" 
            subtitle={taskSummary.overdue > 0 ? "Need attention" : "All on track"}
          />
        </div>
      }
      main={
        <div className="space-y-6">
          <TaskFilters
            currentFilter={currentFilter}
            onFilterChange={() => {}}
            taskCounts={{
              total: taskSummary.total,
              byStatus: taskSummary.byStatus,
              byPriority: taskSummary.byPriority
            }}
          />
          
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                <span className="text-sm text-gray-500">{sampleTasks.length} tasks</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
