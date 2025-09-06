import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import { Project, User } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount'>) => void;
  project?: Project | null;
  users: User[];
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  users
}) => {
  const [formData, setFormData] = useState({
    name: '',
    tags: [] as string[],
    managerId: '',
    deadline: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'Services',
    image: '',
    description: '',
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        tags: project.tags,
        managerId: project.managerId,
        deadline: project.deadline,
        priority: project.priority,
        status: project.status,
        image: project.image || '',
        description: project.description,
      });
    } else {
      setFormData({
        name: '',
        tags: [],
        managerId: '',
        deadline: '',
        priority: 'Medium',
        status: 'Services',
        image: '',
        description: '',
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.managerId) {
      newErrors.managerId = 'Project manager is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const manager = users.find(u => u.id === formData.managerId);
    if (!manager) return;

    onSave({
      ...formData,
      manager
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    handleInputChange('tags', formData.tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`
  }));

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  const statusOptions = [
    { value: 'Services', label: 'Services' },
    { value: 'Customer Care', label: 'Customer Care' },
    { value: 'Development', label: 'Development' },
  ];

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter project name"
          />

          <Select
            label="Project Manager"
            value={formData.managerId}
            onChange={(value) => handleInputChange('managerId', value)}
            options={userOptions}
            error={errors.managerId}
            placeholder="Select project manager"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Deadline"
              type="date"
              value={formatDateForInput(formData.deadline)}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              error={errors.deadline}
            />
          </div>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value)}
            options={priorityOptions}
          />
        </div>

        <Select
          label="Status"
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={statusOptions}
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-2 py-1 rounded"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag"
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
        </div>

        {/* Image URL */}
        <Input
          label="Project Image URL"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          helperText="Provide a URL for the project image"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project description"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};