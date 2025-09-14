import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { 
  Task, 
  TaskId, 
  ProjectId, 
  UserId, 
  TaskStatus, 
  TaskPriority,
  O,
  E,
  pipe
} from '@/lib/types'
import { 
  fetchTasks, 
  createTaskInDb, 
  updateTaskInDb, 
  deleteTaskFromDb 
} from '@/lib/services/task-service'

const TASKS_QUERY_KEY = 'tasks'

export const useTasks = (projectId: ProjectId) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, projectId],
    queryFn: async () => {
      const result = await fetchTasks(projectId)()
      return pipe(
        result,
        E.fold(
          (error) => Promise.reject(new Error(error.message)),
          (tasks) => Promise.resolve(tasks)
        )
      )
    },
    enabled: !!projectId,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      title,
      description = '',
      priority = 'medium' as TaskPriority,
      projectId,
      assigneeId = O.none,
      dueDate = O.none
    }: {
      title: string
      description?: string
      priority?: TaskPriority
      projectId: ProjectId
      assigneeId?: O.Option<UserId>
      dueDate?: O.Option<Date>
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      const result = await createTaskInDb(
        title,
        description,
        priority,
        projectId,
        user.id as UserId,
        assigneeId,
        dueDate
      )()

      return pipe(
        result,
        E.fold(
          (error) => Promise.reject(new Error(error.message)),
          (task) => Promise.resolve(task)
        )
      )
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(
        [TASKS_QUERY_KEY, newTask.projectId],
        (oldTasks: readonly Task[] | undefined) => 
          oldTasks ? [newTask, ...oldTasks] : [newTask]
      )
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      taskId,
      updates
    }: {
      taskId: TaskId
      updates: {
        title?: string
        description?: string
        status?: TaskStatus
        priority?: TaskPriority
        assigneeId?: O.Option<UserId>
        dueDate?: O.Option<Date>
      }
    }) => {
      const result = await updateTaskInDb(taskId, updates)()
      
      return pipe(
        result,
        E.fold(
          (error) => Promise.reject(new Error(error.message)),
          (task) => Promise.resolve(task)
        )
      )
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        [TASKS_QUERY_KEY, updatedTask.projectId],
        (oldTasks: readonly Task[] | undefined) =>
          oldTasks?.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ) || [updatedTask]
      )
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, projectId }: { taskId: TaskId, projectId: ProjectId }) => {
      const result = await deleteTaskFromDb(taskId)()
      
      return pipe(
        result,
        E.fold(
          (error) => Promise.reject(new Error(error.message)),
          () => Promise.resolve({ taskId, projectId })
        )
      )
    },
    onSuccess: ({ taskId, projectId }) => {
      queryClient.setQueryData(
        [TASKS_QUERY_KEY, projectId],
        (oldTasks: readonly Task[] | undefined) =>
          oldTasks?.filter(task => task.id !== taskId) || []
      )
    },
  })
}

export const useUpdateTaskStatus = () => {
  const updateTask = useUpdateTask()

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: TaskId, status: TaskStatus }) => {
      return updateTask.mutateAsync({
        taskId,
        updates: { status }
      })
    },
  })
}
