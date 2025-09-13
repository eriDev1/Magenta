import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { Task } from "@/lib/types";

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

  return (
    <Dashboard 
      user={{ name: user.user_metadata?.full_name || user.email || "User" }}
      sampleTasks={sampleTasks}
    />
  );
}
