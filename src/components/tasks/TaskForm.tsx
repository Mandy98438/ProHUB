import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, User, Project } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  task?: Task | null;
  users: User[];
  projects: Project[];
  preSelectedProjectId?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  users,
  projects,
  preSelectedProjectId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    assigneeId: '',
    projectId: '',
    tags: [] as string[],
    deadline: '',
    status: 'Progress' as 'Feedback' | 'Bug' | 'Progress' | 'Completed',
    image: '',
    description: '',
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        assigneeId: task.assigneeId,
        projectId: task.projectId,
        tags: task.tags,
        deadline: formatDateTimeForInput(task.deadline),
        status: task.status,
        image: task.image || '',
        description: task.description,
      });
    } else {
      setFormData({
        name: '',
        assigneeId: '',
        projectId: preSelectedProjectId || '',
        tags: [],
        deadline: '',
        status: 'Progress',
        image: '',
        description: '',
      });
    }
    setErrors({});
  }, [task, isOpen, preSelectedProjectId]);

  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Assignee is required';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
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

    const assignee = users.find(u => u.id === formData.assigneeId);
    const project = projects.find(p => p.id === formData.projectId);
    
    if (!assignee || !project) return;

    onSave({
      ...formData,
      assignee,
      project
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

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name
  }));

  const statusOptions = [
    { value: 'Progress', label: 'In Progress' },
    { value: 'Feedback', label: 'Needs Feedback' },
    { value: 'Bug', label: 'Bug' },
    { value: 'Completed', label: 'Completed' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter task name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Assignee"
            value={formData.assigneeId}
            onChange={(value) => handleInputChange('assigneeId', value)}
            options={userOptions}
            error={errors.assigneeId}
            placeholder="Select assignee"
          />

          <Select
            label="Project"
            value={formData.projectId}
            onChange={(value) => handleInputChange('projectId', value)}
            options={projectOptions}
            error={errors.projectId}
            placeholder="Select project"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              error={errors.deadline}
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={statusOptions}
          />
        </div>

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
          label="Task Image URL"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          helperText="Provide a URL for the task image"
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
            placeholder="Enter task description"
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
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};