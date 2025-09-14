import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { Task, createTask, O, E, pipe, taskId, projectId, userId } from "@/lib/types";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const sampleTasksData = [
    { id: '1', title: 'Design user interface mockups', description: 'Create wireframes and mockups for the main dashboard and task management interface', status: 'in_progress' as const, priority: 'high' as const, assigneeId: O.some('user-1'), dueDate: O.some(new Date('2024-01-15')), tags: ['design', 'ui/ux'] },
    { id: '2', title: 'Set up database schema', description: 'Design and implement the database tables for users, tasks, and projects', status: 'todo' as const, priority: 'medium' as const, assigneeId: O.some('user-2'), dueDate: O.some(new Date('2024-01-20')), tags: ['backend', 'database'] },
    { id: '3', title: 'Implement authentication', description: 'Add user login, registration, and session management functionality', status: 'completed' as const, priority: 'high' as const, assigneeId: O.some('user-1'), dueDate: O.none, tags: ['auth', 'security'] },
    { id: '4', title: 'Write API documentation', description: 'Document all REST API endpoints and their usage examples', status: 'todo' as const, priority: 'low' as const, assigneeId: O.some('user-3'), dueDate: O.none, tags: ['documentation'] },
    { id: '5', title: 'Add task filtering and sorting', description: 'Implement functionality to filter tasks by status, priority, and date', status: 'todo' as const, priority: 'medium' as const, assigneeId: O.some('user-1'), dueDate: O.some(new Date('2024-01-25')), tags: ['frontend', 'functionality'] }
  ]

  const sampleTasks: Task[] = sampleTasksData
    .map(data => createTask(
      data.id,
      data.title,
      data.description,
      data.priority,
      'proj-1',
      data.assigneeId,
      data.dueDate
    ))
    .filter(E.isRight)
    .map(result => ({
      ...result.right,
      status: sampleTasksData.find(d => d.id === result.right.id.toString())?.status || 'todo',
      tags: sampleTasksData.find(d => d.id === result.right.id.toString())?.tags || [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02')
    }));

  return (
    <Dashboard 
      user={{ name: user.user_metadata?.full_name || user.email || "User" }}
      sampleTasks={sampleTasks}
    />
  );
}
