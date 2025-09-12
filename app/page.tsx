import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TaskCard } from "@/components/task-card";
import { Task } from "@/lib/types";

import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design user interface mockups',
      description: 'Create wireframes and mockups for the main dashboard and task management interface',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Set up database schema',
      description: 'Design and implement the database tables for users, tasks, and projects',
      status: 'todo',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Implement authentication',
      description: 'Add user login, registration, and session management functionality',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints and their usage examples',
      status: 'todo',
      priority: 'low'
    },
    {
      id: '5',
      title: 'Add task filtering and sorting',
      description: 'Implement functionality to filter tasks by status, priority, and date',
      status: 'todo',
      priority: 'medium'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Mageta</Link>
            
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium text-2xl">Mageta - Task Management</h2>
              <div className="text-sm text-gray-500">
                {sampleTasks.length} tasks
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
