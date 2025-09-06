import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Task, Notification, AppState, User } from '../types';

const AppContext = createContext<{
  state: AppState;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  searchProjects: (query: string) => Project[];
  searchTasks: (query: string) => Task[];
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
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

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    tags: ['Web Development', 'React', 'Node.js'],
    managerId: '1',
    manager: mockUsers[0],
    deadline: '2024-12-15',
    priority: 'High',
    status: 'Services',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    description: 'Building a comprehensive e-commerce platform with modern technologies.',
    taskCount: 8,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    tags: ['Mobile', 'React Native', 'Security'],
    managerId: '2',
    manager: mockUsers[1],
    deadline: '2024-11-30',
    priority: 'High',
    status: 'Customer Care',
    image: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    description: 'Secure mobile banking application with biometric authentication.',
    taskCount: 12,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'AI Dashboard',
    tags: ['AI/ML', 'Python', 'Data Visualization'],
    managerId: '3',
    manager: mockUsers[2],
    deadline: '2024-12-01',
    priority: 'Medium',
    status: 'Development',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    description: 'AI-powered dashboard for business intelligence and analytics.',
    taskCount: 6,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  }
];

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Design user authentication flow',
    assigneeId: '1',
    assignee: mockUsers[0],
    projectId: '1',
    project: initialProjects[0],
    tags: ['UI/UX', 'Security'],
    deadline: '2024-02-15T14:30:00',
    status: 'Progress',
    description: 'Create wireframes and prototypes for the authentication system.',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Implement payment gateway',
    assigneeId: '2',
    assignee: mockUsers[1],
    projectId: '1',
    project: initialProjects[0],
    tags: ['Backend', 'Payment'],
    deadline: '2024-02-20T16:00:00',
    status: 'Feedback',
    description: 'Integrate Stripe payment gateway for secure transactions.',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-21'
  },
  {
    id: '3',
    name: 'Fix mobile responsiveness',
    assigneeId: '3',
    assignee: mockUsers[2],
    projectId: '2',
    project: initialProjects[1],
    tags: ['Frontend', 'Mobile'],
    deadline: '2024-02-10T12:00:00',
    status: 'Bug',
    description: 'Resolve mobile layout issues on various screen sizes.',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    name: 'Setup CI/CD pipeline',
    assigneeId: '1',
    assignee: mockUsers[0],
    projectId: '3',
    project: initialProjects[2],
    tags: ['DevOps', 'Automation'],
    deadline: '2024-02-25T10:00:00',
    status: 'Completed',
    description: 'Configure automated testing and deployment pipeline.',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-23'
  }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    projects: initialProjects,
    tasks: initialTasks,
    notifications: [
      {
        id: '1',
        message: 'New task assigned to you: Design user authentication flow',
        type: 'info',
        read: false,
        createdAt: '2024-01-20T10:30:00'
      },
      {
        id: '2',
        message: 'Project deadline approaching: Mobile Banking App',
        type: 'warning',
        read: false,
        createdAt: '2024-01-19T15:45:00'
      },
      {
        id: '3',
        message: 'Task completed: Setup CI/CD pipeline',
        type: 'success',
        read: true,
        createdAt: '2024-01-18T09:15:00'
      }
    ],
    theme: 'dark',
    sidebarCollapsed: false,
  });

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setState(prev => ({ ...prev, theme: savedTheme }));
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      taskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id
          ? { ...project, ...updatedData, updatedAt: new Date().toISOString() }
          : project
      )
    }));
  };

  const deleteProject = (id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id),
      tasks: prev.tasks.filter(task => task.projectId !== id)
    }));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const project = state.projects.find(p => p.id === taskData.projectId);
    const assignee = mockUsers.find(u => u.id === taskData.assigneeId);
    
    if (!project || !assignee) return;

    const newTask: Task = {
      ...taskData,
      project,
      assignee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      projects: prev.projects.map(p =>
        p.id === taskData.projectId
          ? { ...p, taskCount: p.taskCount + 1 }
          : p
      )
    }));
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id
          ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
          : task
      )
    }));
  };

  const deleteTask = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
      projects: prev.projects.map(p =>
        p.id === task?.projectId
          ? { ...p, taskCount: Math.max(0, p.taskCount - 1) }
          : p
      )
    }));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications]
    }));
  };

  const markNotificationRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    }));
  };

  const toggleTheme = () => {
    setState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { ...prev, theme: newTheme };
    });
  };

  const toggleSidebar = () => {
    setState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  const searchProjects = (query: string): Project[] => {
    if (!query.trim()) return state.projects;
    
    const lowercaseQuery = query.toLowerCase();
    return state.projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      project.manager.firstName.toLowerCase().includes(lowercaseQuery) ||
      project.manager.lastName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const searchTasks = (query: string): Task[] => {
    if (!query.trim()) return state.tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return state.tasks.filter(task =>
      task.name.toLowerCase().includes(lowercaseQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      task.assignee.firstName.toLowerCase().includes(lowercaseQuery) ||
      task.assignee.lastName.toLowerCase().includes(lowercaseQuery) ||
      task.project.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <AppContext.Provider value={{
      state,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addNotification,
      markNotificationRead,
      toggleTheme,
      toggleSidebar,
      searchProjects,
      searchTasks
    }}>
      {children}
    </AppContext.Provider>
  );
};