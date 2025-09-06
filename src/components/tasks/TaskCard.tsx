import React from 'react';
import { Calendar, User, MoreVertical, Folder } from 'lucide-react';
import { Task } from '../../types';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Progress':
        return 'info';
      case 'Feedback':
        return 'warning';
      case 'Bug':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const isOverdue = (deadlineString: string) => {
    return new Date(deadlineString) < new Date();
  };

  const { date, time } = formatDateTime(task.deadline);
  const overdue = isOverdue(task.deadline);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      {/* Task Image */}
      {task.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={task.image}
            alt={task.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onClick={() => onClick(task)}
          />
        </div>
      )}

      <div className="p-6" onClick={() => onClick(task)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.name}
          </h3>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <Badge variant={getStatusColor(task.status) as any} size="sm">
            {task.status}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="info" size="sm">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge variant="default" size="sm">
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Project */}
        <div className="flex items-center space-x-2 mb-4">
          <Folder className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {task.project.name}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <img
            src={task.assignee.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
            alt={`${task.assignee.firstName} ${task.assignee.lastName}`}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {task.assignee.firstName} {task.assignee.lastName}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div className="flex flex-col">
            <span className={cn(
              'text-sm',
              overdue 
                ? 'text-red-600 dark:text-red-400 font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            )}>
              {date}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {time}
            </span>
          </div>
          {overdue && (
            <Badge variant="error" size="sm">
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
    </div>
  );
};