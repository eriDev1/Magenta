'use client';

import { useState } from 'react';
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/task-card";
import { TaskForm } from "@/components/task-form";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Button } from "@/components/ui/button";
import { Task, ProjectId, projectId, O, pipe } from "@/lib/types";
import { useTasks } from "@/hooks/use-tasks";
import { Plus } from 'lucide-react';

interface DashboardProps {
  user: {
    name: string;
  };
  projectId: ProjectId;
}

export function Dashboard({ user, projectId }: DashboardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { data: tasks = [], isLoading, error } = useTasks(projectId);

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => pipe(
      t.dueDate,
      O.map(date => date < new Date() && t.status !== 'completed'),
      O.getOrElse(() => false)
    )).length
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          {showTaskForm && (
            <div className="flex justify-center">
              <TaskForm 
                projectId={projectId}
                onClose={() => setShowTaskForm(false)}
                isOpen={showTaskForm}
              />
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading tasks...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-500">Error loading tasks: {error.message}</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
                  <span className="text-sm text-gray-500">{tasks.length} tasks</span>
                </div>
              </div>
              
              <div className="p-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet. Create your first task to get started!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
