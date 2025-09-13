import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Task, TaskFilter, TaskSummary, TaskStatus, TaskPriority } from "@/lib/types";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design user interface mockups',
      description: 'Create wireframes and mockups for the main dashboard and task management interface',
      status: 'in_progress',
      priority: 'high',
      projectId: 'proj-1',
      assigneeId: 'user-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      dueDate: new Date('2024-01-15'),
      tags: ['design', 'ui/ux']
    },
    {
      id: '2',
      title: 'Set up database schema',
      description: 'Design and implement the database tables for users, tasks, and projects',
      status: 'todo',
      priority: 'medium',
      projectId: 'proj-1',
      assigneeId: 'user-2',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      dueDate: new Date('2024-01-20'),
      tags: ['backend', 'database']
    },
    {
      id: '3',
      title: 'Implement authentication',
      description: 'Add user login, registration, and session management functionality',
      status: 'completed',
      priority: 'high',
      projectId: 'proj-1',
      assigneeId: 'user-1',
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-01'),
      tags: ['auth', 'security']
    },
    {
      id: '4',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints and their usage examples',
      status: 'todo',
      priority: 'low',
      projectId: 'proj-1',
      assigneeId: 'user-3',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      tags: ['documentation']
    },
    {
      id: '5',
      title: 'Add task filtering and sorting',
      description: 'Implement functionality to filter tasks by status, priority, and date',
      status: 'todo',
      priority: 'medium',
      projectId: 'proj-1',
      assigneeId: 'user-1',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      dueDate: new Date('2024-01-25'),
      tags: ['frontend', 'functionality']
    }
  ];

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
      overdue: task.dueDate && task.dueDate < new Date() && task.status !== 'completed' 
        ? summary.overdue + 1 
        : summary.overdue
    }), initialSummary);
  };

  const taskSummary = calculateTaskSummary(sampleTasks);
  const currentFilter: TaskFilter = {};

  return (
    <DashboardLayout
      header={
        <Header 
          user={{ name: user.user_metadata?.full_name || user.email || "User" }} 
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
