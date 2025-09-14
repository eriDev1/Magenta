'use client';

import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/task-card";
import { TaskForm } from "@/components/task-form";
import { TaskFilters } from "@/components/tasks/task-filters";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { ProjectId, O } from "@/lib/types";
import { useTasks } from "@/hooks/use-tasks";
import { Plus, LayoutGrid, List, Filter, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface DashboardProps {
  user: {
    name: string;
  };
  projectId: ProjectId;
}

export function Dashboard({ user, projectId }: DashboardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState<'board' | 'list'>('board');
  const { data: tasks = [], isLoading, error } = useTasks(projectId);


  const filteredTasks = tasks.filter(task =>
    searchQuery === '' || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      main={
        <div className="space-y-6">
          {/* Header with search and controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Project Tasks</h1>
              <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                <Button
                  variant={currentView === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('board')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={currentView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Button onClick={() => setShowTaskForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <TaskForm 
                  projectId={projectId}
                  onClose={() => setShowTaskForm(false)}
                  isOpen={showTaskForm}
                />
              </div>
            </div>
          )}

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <TaskFilters 
                currentFilter={{
                  status: O.none,
                  priority: O.none,
                  assigneeId: O.none,
                  search: O.some(searchQuery),
                  overdue: false
                }}
                onFilterChange={() => {}}
                taskCounts={{
                  total: tasks.length,
                  byStatus: {
                    todo: tasks.filter(t => t.status === 'todo').length,
                    in_progress: tasks.filter(t => t.status === 'in_progress').length,
                    completed: tasks.filter(t => t.status === 'completed').length,
                    cancelled: 0
                  },
                  byPriority: {
                    low: tasks.filter(t => t.priority === 'low').length,
                    medium: tasks.filter(t => t.priority === 'medium').length,
                    high: tasks.filter(t => t.priority === 'high').length,
                    urgent: tasks.filter(t => t.priority === 'urgent').length
                  }
                }}
              />
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-500">Loading tasks...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-2">Error loading tasks</div>
                <div className="text-gray-500 text-sm">{error.message}</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 min-h-[600px]">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-gray-400 mb-4">
                    <LayoutGrid className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your search'}
                  </h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    {tasks.length === 0 
                      ? 'Create your first task to get started with your project!'
                      : 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    }
                  </p>
                  {tasks.length === 0 && (
                    <Button onClick={() => setShowTaskForm(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              ) : currentView === 'board' ? (
                <KanbanBoard tasks={filteredTasks} />
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} variant="list" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
    />
  );
}
