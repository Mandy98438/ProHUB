import React, { useState, useEffect } from 'react';
import { Plus, Filter, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from '../common/Button';
import { Task, User, Project } from '../../types';

interface TasksViewProps {
  searchQuery: string;
}

// Mock users for task assignment
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

export const TasksView: React.FC<TasksViewProps> = ({ searchQuery }) => {
  const { user } = useAuth();
  const { state, addTask, updateTask, deleteTask, searchTasks, addNotification } = useApp();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tasks to show only those assigned to current user
  useEffect(() => {
    let tasks = state.tasks.filter(task => task.assigneeId === user?.id);
    
    if (searchQuery.trim()) {
      tasks = searchTasks(searchQuery).filter(task => task.assigneeId === user?.id);
    }

    if (statusFilter !== 'all') {
      tasks = tasks.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(tasks);
  }, [searchQuery, state.tasks, user?.id, statusFilter, searchTasks]);

  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.name}"? This action cannot be undone.`)) {
      deleteTask(task.id);
      addNotification({
        message: `Task "${task.name}" has been deleted`,
        type: 'info',
        read: false
      });
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      addNotification({
        message: `Task "${taskData.name}" has been updated`,
        type: 'success',
        read: false
      });
    } else {
      addTask(taskData);
      addNotification({
        message: `New task "${taskData.name}" has been created`,
        type: 'success',
        read: false
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    // In a real app, this would navigate to task details
    console.log('Task clicked:', task);
  };

  // Calculate statistics
  const myTasks = state.tasks.filter(task => task.assigneeId === user?.id);
  const completedTasks = myTasks.filter(task => task.status === 'Completed');
  const inProgressTasks = myTasks.filter(task => task.status === 'Progress');
  const overdueTasks = myTasks.filter(task => 
    new Date(task.deadline) < new Date() && task.status !== 'Completed'
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tasks assigned to you
          </p>
        </div>
        <Button onClick={handleNewTask}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inProgressTasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overdueTasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myTasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Tasks', count: myTasks.length },
          { key: 'Progress', label: 'In Progress', count: inProgressTasks.length },
          { key: 'Feedback', label: 'Needs Feedback', count: myTasks.filter(t => t.status === 'Feedback').length },
          { key: 'Bug', label: 'Bug', count: myTasks.filter(t => t.status === 'Bug').length },
          { key: 'Completed', label: 'Completed', count: completedTasks.length },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === filter.key
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No tasks found' : 'No tasks assigned'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Tasks assigned to you will appear here'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={handleNewTask}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={handleTaskClick}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSave={handleSaveTask}
        task={editingTask}
        users={mockUsers}
        projects={state.projects}
      />
    </div>
  );
};