import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export { O, E, TE, pipe }

export type TaskId = string & { readonly __brand: 'TaskId' }
export type UserId = string & { readonly __brand: 'UserId' }
export type ProjectId = string & { readonly __brand: 'ProjectId' }

export const taskId = (id: string): TaskId => id as TaskId
export const userId = (id: string): UserId => id as UserId
export const projectId = (id: string): ProjectId => id as ProjectId

export interface Database {
  public: {
    tasks: {
      Row: {
        id: string
        title: string
        description: string
        status: TaskStatus
        priority: TaskPriority
        project_id: string
        assignee_id: string | null
        creator_id: string
        due_date: string | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        title: string
        description?: string
        status?: TaskStatus
        priority?: TaskPriority
        project_id: string
        assignee_id?: string | null
        creator_id: string
        due_date?: string | null
      }
      Update: {
        id?: string
        title?: string
        description?: string
        status?: TaskStatus
        priority?: TaskPriority
        assignee_id?: string | null
        due_date?: string | null
      }
    }
    projects: {
      Row: {
        id: string
        name: string
        description: string
        status: ProjectStatus
        owner_id: string
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        name: string
        description?: string
        status?: ProjectStatus
        owner_id: string
      }
      Update: {
        id?: string
        name?: string
        description?: string
        status?: ProjectStatus
      }
    }
    project_members: {
      Row: {
        id: string
        project_id: string
        user_id: string
        role: 'admin' | 'member' | 'viewer'
        joined_at: string
      }
      Insert: {
        project_id: string
        user_id: string
        role?: 'admin' | 'member' | 'viewer'
      }
      Update: {
        role?: 'admin' | 'member' | 'viewer'
      }
    }
    task_tags: {
      Row: {
        id: string
        task_id: string
        tag: string
        created_at: string
      }
      Insert: {
        task_id: string
        tag: string
      }
      Update: never
    }
  }
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed'

export interface Task {
  readonly id: TaskId
  readonly title: string
  readonly description: string
  readonly status: TaskStatus
  readonly priority: TaskPriority
  readonly projectId: ProjectId
  readonly assigneeId: O.Option<UserId>
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly dueDate: O.Option<Date>
  readonly tags: readonly string[]
}

export interface Project {
  readonly id: ProjectId
  readonly name: string
  readonly description: string
  readonly status: ProjectStatus
  readonly ownerId: UserId
  readonly memberIds: readonly UserId[]
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface User {
  readonly id: UserId
  readonly name: string
  readonly email: string
  readonly role: 'admin' | 'member' | 'viewer'
  readonly avatar: O.Option<string>
}

export type TaskError = 
  | { readonly _tag: 'InvalidTitle'; readonly message: string }
  | { readonly _tag: 'TaskNotFound'; readonly id: TaskId }
  | { readonly _tag: 'InvalidTransition'; readonly from: TaskStatus; readonly to: TaskStatus }
  | { readonly _tag: 'ValidationError'; readonly field: string; readonly message: string }

export const invalidTitle = (message: string): TaskError => ({ _tag: 'InvalidTitle', message })
export const taskNotFound = (id: TaskId): TaskError => ({ _tag: 'TaskNotFound', id })
export const invalidTransition = (from: TaskStatus, to: TaskStatus): TaskError => ({ _tag: 'InvalidTransition', from, to })
export const validationError = (field: string, message: string): TaskError => ({ _tag: 'ValidationError', field, message })

export type TaskResult<T> = E.Either<TaskError, T>
export type AsyncTaskResult<T> = TE.TaskEither<TaskError, T>

export const createTask = (
  id: string,
  title: string,
  description: string = '',
  priority: TaskPriority = 'medium',
  projId: string,
  assigneeId: O.Option<string> = O.none,
  dueDate: O.Option<Date> = O.none
): TaskResult<Task> => pipe(
  title.trim(),
  (trimmedTitle) => trimmedTitle.length === 0 
    ? E.left(invalidTitle('Title cannot be empty'))
    : trimmedTitle.length > 200
    ? E.left(invalidTitle('Title must be less than 200 characters'))
    : E.right({
        id: taskId(id),
        title: trimmedTitle,
        description: description.trim(),
        status: 'todo' as const,
        priority,
        projectId: projectId(projId),
        assigneeId: pipe(assigneeId, O.map(userId)),
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate,
        tags: []
      })
)

export const updateTaskStatus = (task: Task, newStatus: TaskStatus): TaskResult<Task> => {
  const isValidTransition = (from: TaskStatus, to: TaskStatus): boolean => {
    if (from === 'completed' || from === 'cancelled') return false
    if (from === 'todo' && to === 'completed') return false
    return true
  }

  return isValidTransition(task.status, newStatus)
    ? E.right({ ...task, status: newStatus, updatedAt: new Date() })
    : E.left(invalidTransition(task.status, newStatus))
}

export const assignTask = (task: Task, assigneeId: UserId): Task => ({
  ...task,
  assigneeId: O.some(assigneeId),
  updatedAt: new Date()
})

export const unassignTask = (task: Task): Task => ({
  ...task,
  assigneeId: O.none,
  updatedAt: new Date()
})

export const filterTasksByStatus = (tasks: readonly Task[], status: TaskStatus): readonly Task[] =>
  tasks.filter(task => task.status === status)

export const filterTasksByPriority = (tasks: readonly Task[], priority: TaskPriority): readonly Task[] =>
  tasks.filter(task => task.priority === priority)

export const filterTasksByAssignee = (tasks: readonly Task[], assigneeId: UserId): readonly Task[] =>
  tasks.filter(task => pipe(
    task.assigneeId,
    O.map(id => id === assigneeId),
    O.getOrElse(() => false)
  ))

export const sortTasksByPriority = (tasks: readonly Task[]): readonly Task[] => {
  const priorityOrder: Record<TaskPriority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3
  }
  
  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

export const getOverdueTasks = (tasks: readonly Task[]): readonly Task[] =>
  tasks.filter(task => pipe(
    task.dueDate,
    O.map(date => date < new Date() && task.status !== 'completed'),
    O.getOrElse(() => false)
  ))

export interface TaskFilter {
  readonly status: O.Option<TaskStatus>
  readonly priority: O.Option<TaskPriority>
  readonly assigneeId: O.Option<UserId>
  readonly search: O.Option<string>
  readonly overdue: boolean
}

export const emptyFilter: TaskFilter = {
  status: O.none,
  priority: O.none,
  assigneeId: O.none,
  search: O.none,
  overdue: false
}

export const applyTaskFilter = (tasks: readonly Task[], filter: TaskFilter): readonly Task[] =>
  pipe(
    tasks,
    (ts) => pipe(filter.status, O.fold(() => ts, status => filterTasksByStatus(ts, status))),
    (ts) => pipe(filter.priority, O.fold(() => ts, priority => filterTasksByPriority(ts, priority))),
    (ts) => pipe(filter.assigneeId, O.fold(() => ts, assignee => filterTasksByAssignee(ts, assignee))),
    (ts) => filter.overdue ? getOverdueTasks(ts) : ts,
    (ts) => pipe(
      filter.search,
      O.fold(
        () => ts,
        search => ts.filter(task => 
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        )
      )
    )
  )