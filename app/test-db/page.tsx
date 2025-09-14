'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDbPage() {
  const [status, setStatus] = useState('Testing...')
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setStatus('Not authenticated')
          return
        }

        setStatus(`Authenticated as: ${user.email}`)

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', user.id)

        if (projectsError) {
          setStatus(`Projects error: ${projectsError.message}`)
          return
        }

        setProjects(projectsData || [])
        setStatus(`Found ${projectsData?.length || 0} projects`)

        if (projectsData && projectsData.length > 0) {
          const projectId = projectsData[0].id
          
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', projectId)

          if (tasksError) {
            setStatus(`Tasks error: ${tasksError.message}`)
            return
          }

          setTasks(tasksData || [])
          setStatus(`Found ${tasksData?.length || 0} tasks in project ${projectId}`)
        }

      } catch (error) {
        setStatus(`Error: ${error}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <p className="mb-4">Status: {status}</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(projects, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      </div>
    </div>
  )
}
