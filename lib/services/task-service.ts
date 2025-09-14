import { createClient } from '@/lib/supabase/client'
import { 
  Task, 
  TaskId, 
  ProjectId, 
  UserId, 
  TaskStatus, 
  TaskPriority,
  TaskError,
  AsyncTaskResult,
  taskId,
  projectId,
  userId,
  O,
  E,
  TE,
  pipe
} from '@/lib/types'

const mapDbTaskToTask = (dbTask: any): Task => ({
  id: taskId(dbTask.id),
  title: dbTask.title,
  description: dbTask.description || '',
  status: dbTask.status,
  priority: dbTask.priority,
  projectId: projectId(dbTask.project_id),
  assigneeId: dbTask.assignee_id ? O.some(userId(dbTask.assignee_id)) : O.none,
  createdAt: new Date(dbTask.created_at),
  updatedAt: new Date(dbTask.updated_at),
  dueDate: dbTask.due_date ? O.some(new Date(dbTask.due_date)) : O.none,
  tags: []
})

const handleSupabaseError = (error: any): TaskError => ({
  _tag: 'ValidationError',
  field: 'database',
  message: error.message || 'Database operation failed'
})

export const fetchTasks = (projectId: ProjectId): AsyncTaskResult<readonly Task[]> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        console.log('Fetching tasks for project:', projectId)
        const result = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
        console.log('Supabase result:', result)
        return result
      },
      handleSupabaseError
    ),
    TE.chain(({ data, error }) =>
      error
        ? TE.left(handleSupabaseError(error))
        : TE.right(data?.map(mapDbTaskToTask) || [])
    )
  )

export const createTaskInDb = (
  title: string,
  description: string,
  priority: TaskPriority,
  projectId: ProjectId,
  creatorId: UserId,
  assigneeId: O.Option<UserId> = O.none,
  dueDate: O.Option<Date> = O.none
): AsyncTaskResult<Task> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        console.log('Creating task with data:', {
          title: title.trim(),
          description: description.trim(),
          priority,
          project_id: projectId,
          creator_id: creatorId,
          assignee_id: pipe(assigneeId, O.getOrElse(() => null as string | null)),
          due_date: pipe(dueDate, O.map(d => d.toISOString()), O.getOrElse(() => null as string | null))
        })
        
        const result = await supabase
          .from('tasks')
          .insert({
            title: title.trim(),
            description: description.trim(),
            priority,
            project_id: projectId,
            creator_id: creatorId,
            assignee_id: pipe(assigneeId, O.getOrElse(() => null as string | null)),
            due_date: pipe(dueDate, O.map(d => d.toISOString()), O.getOrElse(() => null as string | null))
          })
          .select()
          .single()
        
        console.log('Create task result:', result)
        return result
      },
      handleSupabaseError
    ),
    TE.chain(({ data, error }) =>
      error
        ? TE.left(handleSupabaseError(error))
        : data
        ? TE.right(mapDbTaskToTask(data))
        : TE.left({ _tag: 'ValidationError', field: 'task', message: 'Failed to create task' })
    )
  )

export const updateTaskInDb = (
  taskId: TaskId,
  updates: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    assigneeId?: O.Option<UserId>
    dueDate?: O.Option<Date>
  }
): AsyncTaskResult<Task> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        const updateData: any = {}
        if (updates.title !== undefined) updateData.title = updates.title.trim()
        if (updates.description !== undefined) updateData.description = updates.description.trim()
        if (updates.status !== undefined) updateData.status = updates.status
        if (updates.priority !== undefined) updateData.priority = updates.priority
        if (updates.assigneeId !== undefined) {
          updateData.assignee_id = pipe(updates.assigneeId, O.getOrElse(() => null as string | null))
        }
        if (updates.dueDate !== undefined) {
          updateData.due_date = pipe(updates.dueDate, O.map(d => d.toISOString()), O.getOrElse(() => null as string | null))
        }

        const result = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', taskId)
          .select()
          .single()
        return result
      },
      handleSupabaseError
    ),
    TE.chain(({ data, error }) =>
      error
        ? TE.left(handleSupabaseError(error))
        : data
        ? TE.right(mapDbTaskToTask(data))
        : TE.left({ _tag: 'TaskNotFound', id: taskId })
    )
  )

export const deleteTaskFromDb = (taskId: TaskId): AsyncTaskResult<boolean> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        const result = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
        return result
      },
      handleSupabaseError
    ),
    TE.chain(({ error }) =>
      error
        ? TE.left(handleSupabaseError(error))
        : TE.right(true)
    )
  )

export const fetchTaskTags = (taskId: TaskId): AsyncTaskResult<readonly string[]> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        const result = await supabase
          .from('task_tags')
          .select('tag')
          .eq('task_id', taskId)
        return result
      },
      handleSupabaseError
    ),
    TE.chain((result: any) =>
      result.error
        ? TE.left(handleSupabaseError(result.error))
        : TE.right(result.data?.map((t: any) => t.tag) || [])
    )
  )

export const addTaskTag = (taskId: TaskId, tag: string): AsyncTaskResult<boolean> =>
  pipe(
    TE.tryCatch(
      async () => {
        const supabase = createClient()
        const result = await supabase
          .from('task_tags')
          .insert({ task_id: taskId, tag: tag.trim().toLowerCase() })
        return result
      },
      handleSupabaseError
    ),
    TE.chain((result: any) =>
      result.error
        ? TE.left(handleSupabaseError(result.error))
        : TE.right(true)
    )
  )
