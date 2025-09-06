export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  tags: string[];
  managerId: string;
  manager: User;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  image?: string;
  description: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  assigneeId: string;
  assignee: User;
  projectId: string;
  project: Project;
  tags: string[];
  deadline: string;
  status: 'Feedback' | 'Bug' | 'Progress' | 'Completed';
  image?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string; confirmPassword: string }) => Promise<boolean>;
  logout: () => void;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}