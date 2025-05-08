import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success';
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'default',
  showLabel = true
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-500'
  };
  
  return (
    <div className="w-full">
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {normalizedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;