import React from 'react';

interface SkeletonProps {
  className?: string;
  type?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', type = 'text' }) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const types = {
    text: 'h-4 w-3/4 rounded',
    rectangular: 'h-24 w-full rounded-md',
    circular: 'h-12 w-12 rounded-full',
  };

  return (
    <div className={`${baseClasses} ${types[type]} ${className}`} aria-hidden="true"></div>
  );
};
