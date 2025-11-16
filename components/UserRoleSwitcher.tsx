
import React from 'react';
import { UserRole } from '../types';
import { Users } from 'lucide-react';

interface UserRoleSwitcherProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const UserRoleSwitcher: React.FC<UserRoleSwitcherProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="relative">
      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value as UserRole)}
        className="pl-10 pr-4 py-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
      >
        {Object.values(UserRole).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserRoleSwitcher;
