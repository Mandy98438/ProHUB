import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Button } from '../common/Button';
import { Project, User } from '../../types';

interface ProjectsViewProps {
  searchQuery: string;
}

// Mock users for project management
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({ searchQuery }) => {
  const { state, addProject, updateProject, deleteProject, searchProjects, addNotification } = useApp();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState(state.projects);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredProjects(searchProjects(searchQuery));
    } else {
      setFilteredProjects(state.projects);
    }
  }, [searchQuery, state.projects, searchProjects]);

  const handleNewProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProject(project.id);
      addNotification({
        message: `Project "${project.name}" has been deleted`,
        type: 'info',
        read: false
      });
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      addNotification({
        message: `Project "${projectData.name}" has been updated`,
        type: 'success',
        read: false
      });
    } else {
      addProject(projectData);
      addNotification({
        message: `New project "${projectData.name}" has been created`,
        type: 'success',
        read: false
      });
    }
  };

  const handleProjectClick = (project: Project) => {
    // In a real app, this would navigate to project details
    console.log('Project clicked:', project);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your projects and track progress
          </p>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {state.projects.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">High Priority</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            {state.projects.filter(p => p.priority === 'High').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Development</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {state.projects.filter(p => p.status === 'Development').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {state.projects.reduce((acc, p) => acc + p.taskCount, 0)}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first project'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
        onSave={handleSaveProject}
        project={editingProject}
        users={mockUsers}
      />
    </div>
  );
};