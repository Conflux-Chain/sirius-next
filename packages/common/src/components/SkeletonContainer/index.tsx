import React, { ReactNode } from 'react';

interface SkeletonElementProps {
  type?: 'text' | 'title' | 'thumbnail' | 'avatar';
  shown: boolean;
  children: ReactNode;
  className?: string;
}

const SkeletonContainer: React.FC<SkeletonElementProps> = ({
  shown,
  children,
  type = 'title',
  className = '',
}) => {
  if (!shown) {
    return children;
  }

  const baseClasses = 'animate-pulse bg-gray-300 rounded';
  let specificClasses = '';

  switch (type) {
    case 'text':
      specificClasses = 'w-[24px] h-[16px]';
      break;
    case 'title':
      specificClasses = 'w-[38px] h-[24px] rounded-lg';
      break;
    case 'thumbnail':
      specificClasses = 'w-[96px] h-[48px] rounded-lg';
      break;
    case 'avatar':
      specificClasses = 'w-[48px] h-[48px] rounded-full';
      break;
  }

  const combinedClasses =
    `${baseClasses} ${specificClasses} ${className}`.trim();

  return <div className={combinedClasses}></div>;
};

export default SkeletonContainer;
