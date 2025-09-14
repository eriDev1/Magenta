'use client'

import { useState } from 'react'
import { Task, TaskStatus, O } from '@/lib/types'
import { useUpdateTaskStatus, useDeleteTask } from '@/hooks/use-tasks'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Play, CheckCircle, XCircle, Trash2 } from 'lucide-react'

interface TaskActionsProps {
  task: Task
}

export function TaskActions({ task }: TaskActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const handleStatusUpdate = async (status: TaskStatus) => {
    try {
      await updateStatus.mutateAsync({ taskId: task.id, status })
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync({ 
        taskId: task.id, 
        projectId: task.projectId 
      })
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getStatusActions = () => {
    const actions = []
    
    if (task.status === 'todo') {
      actions.push({
        label: 'Start Task',
        icon: Play,
        action: () => handleStatusUpdate('in_progress'),
        disabled: updateStatus.isPending
      })
    }
    
    if (task.status === 'in_progress') {
      actions.push({
        label: 'Complete',
        icon: CheckCircle,
        action: () => handleStatusUpdate('completed'),
        disabled: updateStatus.isPending
      })
    }
    
    if (task.status !== 'cancelled' && task.status !== 'completed') {
      actions.push({
        label: 'Cancel',
        icon: XCircle,
        action: () => handleStatusUpdate('cancelled'),
        disabled: updateStatus.isPending
      })
    }
    
    return actions
  }

  const statusActions = getStatusActions()

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          {statusActions.map((action, index) => {
            const Icon = action.icon
            return (
              <DropdownMenuItem
                key={index}
                onClick={action.action}
                disabled={action.disabled}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            )
          })}
          
          {statusActions.length > 0 && <DropdownMenuSeparator />}
          
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
