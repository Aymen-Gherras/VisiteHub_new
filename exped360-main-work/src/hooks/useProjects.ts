import { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../api/types';
import { apiService } from '../api';

export function useProjects(status?: ProjectStatus, propertyOwnerId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjects(status, propertyOwnerId);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [status, propertyOwnerId]);

  const refetch = () => {
    fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    refetch
  };
}

export function useProjectsByOwner(propertyOwnerId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyOwnerId) {
      setProjects([]);
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProjectsByOwner(propertyOwnerId);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [propertyOwnerId]);

  return {
    projects,
    loading,
    error
  };
}

export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProject(id);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return {
    project,
    loading,
    error
  };
}
