import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProjectContext = createContext(null);

export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const PROJECT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      setError('فشل في تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (error) {
      setError('فشل في إنشاء المشروع');
      throw error;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}`, projectData);
      setProjects(projects.map(p => p.id === projectId ? response.data : p));
      if (currentProject?.id === projectId) {
        setCurrentProject(response.data);
      }
      return response.data;
    } catch (error) {
      setError('فشل في تحديث المشروع');
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (error) {
      setError('فشل في حذف المشروع');
      throw error;
    }
  };

  const addTeamMember = async (projectId, userId) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/members`, { userId });
      setProjects(projects.map(p => p.id === projectId ? response.data : p));
      if (currentProject?.id === projectId) {
        setCurrentProject(response.data);
      }
    } catch (error) {
      setError('فشل في إضافة عضو للمشروع');
      throw error;
    }
  };

  const removeTeamMember = async (projectId, userId) => {
    try {
      const response = await axios.delete(`/api/projects/${projectId}/members/${userId}`);
      setProjects(projects.map(p => p.id === projectId ? response.data : p));
      if (currentProject?.id === projectId) {
        setCurrentProject(response.data);
      }
    } catch (error) {
      setError('فشل في إزالة عضو من المشروع');
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      error,
      currentProject,
      setCurrentProject,
      createProject,
      updateProject,
      deleteProject,
      addTeamMember,
      removeTeamMember,
      PROJECT_STATUS,
      PROJECT_PRIORITY
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext); 