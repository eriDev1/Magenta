// Core domain types for Mageta - following functional programming principles

import { ReactNode } from "react";

export type TaskId = string;
export type ProjectId = string;
export type UserId = string;

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: ProjectId;
  assigneeId: UserId;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

export interface Project {
  id: ProjectId;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: UserId;
  memberIds: UserId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: UserId;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
}

export interface TaskListView {
  tasks: Task[];
  totalCount: number;
  filteredCount: number;
  currentFilter: TaskFilter;
}

export interface ProjectDashboard {
  project: Project;
  taskSummary: TaskSummary;
  recentTasks: Task[];
  members: User[];
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: UserId;
  projectId?: ProjectId;
  tags?: string[];
  search?: string;
}

export interface TaskSummary {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}