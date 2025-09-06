import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { ProjectsView } from '../projects/ProjectsView';
import { TasksView } from '../tasks/TasksView';

export const MainLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbs = () => {
    switch (activeView) {
      case 'projects':
        return [{ label: 'Projects' }];
      case 'tasks':
        return [{ label: 'My Tasks' }];
      default:
        return [{ label: 'Dashboard' }];
    }
  };

  const handleNewClick = () => {
    // This will be handled by the respective view components
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectsView searchQuery={searchQuery} />;
      case 'tasks':
        return <TasksView searchQuery={searchQuery} />;
      default:
        return <ProjectsView searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopNavigation
          activeView={activeView}
          breadcrumbs={getBreadcrumbs()}
          onNewClick={handleNewClick}
          onSearch={handleSearch}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};