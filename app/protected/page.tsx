import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { projectId } from "@/lib/types";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  let userProjectId: string | null = null;
  let errorMessage = '';
  
  try {
    console.log('Checking for existing projects for user:', user.id);
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('owner_id', user.id)
      .limit(1);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      errorMessage = `Failed to fetch projects: ${projectsError.message}`;
    } else if (projects && projects.length > 0) {
      console.log('Found existing project:', projects[0]);
      userProjectId = projects[0].id;
    } else {
      console.log('No existing projects found, creating new one...');
      
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert({
          name: 'My Tasks',
          description: 'Default project for task management',
          owner_id: user.id
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating project:', createError);
        errorMessage = `Failed to create project: ${createError.message}`;
      } else if (newProject) {
        console.log('Created new project:', newProject);
        userProjectId = newProject.id;
        
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({
            project_id: newProject.id,
            user_id: user.id,
            role: 'admin'
          });

        if (memberError) {
          console.error('Error adding project member:', memberError);
          errorMessage = `Failed to add project member: ${memberError.message}`;
        } else {
          console.log('Successfully added project member');
        }
      } else {
        errorMessage = 'Failed to create project: No data returned';
      }
    }
  } catch (error) {
    console.error('Unexpected error setting up project:', error);
    errorMessage = `Unexpected error: ${error}`;
  }

  if (!userProjectId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Setup Error</h1>
          <p className="text-gray-600 mb-4">Unable to load your project. Please check the following:</p>
          <div className="text-left bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {errorMessage || 'Unknown error occurred'}
            </p>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Make sure you've run the database schema in Supabase</p>
            <p>2. Check that your Supabase credentials are correct</p>
            <p>3. Verify you're logged in properly</p>
            <p>4. Check the browser console for more details</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dashboard 
      user={{ name: user.user_metadata?.full_name || user.email || "User" }}
      projectId={projectId(userProjectId)}
    />
  );
}
