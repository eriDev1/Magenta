import { useState, useCallback } from 'react'
import { 
  Task, 
  TaskFilter, 
  TaskStatus, 
  TaskPriority, 
  UserId,
  createTask,
  updateTaskStatus,
  assignTask,
  unassignTask,
  applyTaskFilter,
  sortTasksByPriority,
  emptyFilter,
  O,
  E,
  pipe
} from '@/lib/types'

export const useTaskOperations = (initialTasks: readonly Task[] = []) => {
  const [tasks, setTasks] = useState<readonly Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>(emptyFilter)

  const addTask = useCallback((
    id: string,
    title: string,
    description?: string,
    priority?: TaskPriority,
    projectId?: string,
    assigneeId?: string,
    dueDate?: Date
  ) => {
    const result = createTask(
      id,
      title,
      description,
      priority,
      projectId || 'default-project',
      assigneeId ? O.some(assigneeId) : O.none,
      dueDate ? O.some(dueDate) : O.none
    )
    
    if (E.isRight(result)) {
      setTasks(prev => [...prev, result.right])
      return E.right(result.right)
    }
    
    return result
  }, [])

  const updateStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const result = updateTaskStatus(task, status)
        return E.isRight(result) ? result.right : task
      }
      return task
    }))
  }, [])

  const assignTaskToUser = useCallback((taskId: string, userId: UserId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? assignTask(task, userId) : task
    ))
  }, [])

  const unassignTaskFromUser = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? unassignTask(task) : task
    ))
  }, [])

  const updateFilter = useCallback((newFilter: Partial<TaskFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
  }, [])

  const clearFilter = useCallback(() => {
    setFilter(emptyFilter)
  }, [])

  const filteredTasks = pipe(
    tasks,
    (ts) => applyTaskFilter(ts, filter),
    sortTasksByPriority
  )

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
    overdue: tasks.filter(t => pipe(
      t.dueDate,
      O.map(date => date < new Date() && t.status !== 'completed'),
      O.getOrElse(() => false)
    )).length
  }

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    taskStats,
    addTask,
    updateStatus,
    assignTaskToUser,
    unassignTaskFromUser,
    updateFilter,
    clearFilter
  }
}
