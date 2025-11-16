
import React, { useState, useMemo } from 'react';
import { Bell, Check } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';
import { User } from '../types';

interface NotificationsProps {
  user: User;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS.filter(n => n.userId === user.id));

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-bkg-light dark:hover:bg-bkg-dark focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-danger text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card-light dark:bg-card-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark z-20">
          <div className="p-3 flex justify-between items-center border-b border-border-light dark:border-border-dark">
            <h4 className="font-semibold">Notificações</h4>
            <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline">Marcar todas como lidas</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 border-b border-border-light dark:border-border-dark flex items-start space-x-3 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>}
                <div className="flex-grow">
                  <p className="text-sm">{n.message}</p>
                  <time className="text-xs text-text-muted-light dark:text-text-muted-dark">{n.timestamp.toLocaleTimeString()}</time>
                </div>
                {!n.read && (
                  <button onClick={() => handleMarkAsRead(n.id)} title="Marcar como lida" className="p-1 text-secondary rounded-full hover:bg-green-100 dark:hover:bg-green-900">
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            )) : <p className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">Nenhuma notificação.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
