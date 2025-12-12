'use client';

import { useRouter } from 'next/navigation';
import ProjectForm from '../../components/projects/ProjectForm';
import { Project } from '../../../../api/types';

export default function CreateProject() {
  const router = useRouter();

  const handleProjectCreated = (project: Project) => {
    // Redirect to projects list after successful creation
    router.push('/admin/projects');
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
              <p className="mt-2 text-gray-600">
                Add a new project for a promoteur
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Projects
            </button>
          </div>
        </div>

        {/* Project Form */}
        <ProjectForm
          onSave={handleProjectCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
