'use client';

import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Task, O, pipe } from "@/lib/types";
import { useTaskOperations } from "@/hooks/use-task-operations";

interface DashboardProps {
  user: {
    name: string;
  };
  sampleTasks: Task[];
}

export function Dashboard({ user, sampleTasks }: DashboardProps) {
  const {
    tasks,
    filter,
    taskStats,
    updateFilter,
    clearFilter,
    updateStatus
  } = useTaskOperations(sampleTasks);

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
            value={taskStats.total} 
            color="blue" 
          />
          <StatCard 
            title="In Progress" 
            value={taskStats.inProgress} 
            color="yellow" 
          />
          <StatCard 
            title="Completed" 
            value={taskStats.completed} 
            color="green" 
          />
          <StatCard 
            title="Overdue" 
            value={taskStats.overdue} 
            color="red" 
            subtitle={taskStats.overdue > 0 ? "Need attention" : "All on track"}
          />
        </div>
      }
      main={
        <div className="space-y-6">
          <TaskFilters
            currentFilter={filter}
            onFilterChange={updateFilter}
            taskCounts={{
              total: taskStats.total,
              byStatus: {
                todo: taskStats.todo,
                in_progress: taskStats.inProgress,
                completed: taskStats.completed,
                cancelled: taskStats.cancelled
              },
              byPriority: {
                low: 0,
                medium: 0,
                high: 0,
                urgent: 0
              }
            }}
          />
          
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                <span className="text-sm text-gray-500">{tasks.length} filtered tasks</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
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
