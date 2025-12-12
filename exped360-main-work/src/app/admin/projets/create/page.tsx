'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCreationTabs from '../../components/projects/ProjectCreationTabs';
import { Project } from '../../../../api';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

export default function CreateProject() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [projectData, setProjectData] = useState<ProjectFormData>({});

  const handleProjectCreated = (project: Project) => {
    // Redirect to projects list after successful creation
    router.push('/admin/projets');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
              <p className="mt-2 text-gray-600">
                Add a new development project with detailed information
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/projets')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Projects
            </button>
          </div>
        </div>

        {/* Project Creation Tabs */}
        <ProjectCreationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectData={projectData}
          setProjectData={setProjectData}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}
