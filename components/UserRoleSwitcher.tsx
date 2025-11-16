import React from 'react';
import { User } from '../types';
import { Users } from 'lucide-react';

interface UserRoleSwitcherProps {
  users: User[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
}

const UserRoleSwitcher: React.FC<UserRoleSwitcherProps> = ({ users, selectedUserId, onUserChange }) => {
  return (
    <div className="relative">
      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
      <select
        value={selectedUserId}
        onChange={(e) => onUserChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserRoleSwitcher;