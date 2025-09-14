'use client'

import { useState } from 'react'
import { useCreateTask } from '@/hooks/use-tasks'
import { TaskPriority, ProjectId, O, pipe } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

interface TaskFormProps {
  projectId: ProjectId
  onClose?: () => void
  isOpen?: boolean
}

export function TaskForm({ projectId, onClose, isOpen = true }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')

  const createTask = useCreateTask()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      console.error('Title is required')
      return
    }

    console.log('Creating task with data:', {
      title: title.trim(),
      description: description.trim(),
      priority,
      projectId,
      dueDate: dueDate ? new Date(dueDate) : null
    })

    try {
      const result = await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        priority,
        projectId,
        dueDate: dueDate ? O.some(new Date(dueDate)) : O.none
      })

      console.log('Task created successfully:', result)

      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      onClose?.()
    } catch (error) {
      console.error('Failed to create task:', error)
      alert(`Failed to create task: ${error}`)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">New Task</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              autoFocus
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Due date"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={!title.trim() || createTask.isPending}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </Button>
            
            {onClose && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
