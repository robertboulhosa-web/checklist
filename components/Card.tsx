
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-md border border-border-light dark:border-border-dark overflow-hidden flex flex-col ${className}`}>
      <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center space-x-3">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{title}</h3>
      </div>
      <div className="p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
