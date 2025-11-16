
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from './types';
import { USERS } from './data/mockData';
import OperatorDashboard from './views/OperatorDashboard';
import AdminDashboard from './views/AdminDashboard';
import ManagerDashboard from './views/ManagerDashboard';
import ThemeToggle from './components/ThemeToggle';
import UserRoleSwitcher from './components/UserRoleSwitcher';
import Notifications from './components/Notifications';
import { LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.OPERATOR);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const currentUser = useMemo(() => {
    return USERS.find(user => user.role === currentUserRole) || USERS[0];
  }, [currentUserRole]);

  const renderDashboard = () => {
    switch (currentUserRole) {
      case UserRole.OPERATOR:
        return <OperatorDashboard user={currentUser} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={currentUser} />;
      case UserRole.MANAGER:
        return <ManagerDashboard user={currentUser} />;
      default:
        return <OperatorDashboard user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-bkg-light dark:bg-bkg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-card-light dark:bg-card-dark shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
               <LogIn className="h-8 w-8 text-primary" />
               <h1 className="text-xl font-bold">Operations Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserRoleSwitcher
                selectedRole={currentUserRole}
                onRoleChange={setCurrentUserRole}
              />
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <Notifications user={currentUser} />
              <div className="flex items-center space-x-2">
                 <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                 <span className="hidden sm:inline font-medium">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default App;
